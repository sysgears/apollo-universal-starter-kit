import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import { ImagePicker, Permissions } from 'expo';
import { ReactNativeFile } from 'apollo-upload-client';
import * as mime from 'react-native-mime-types';
import url from 'url';
import { View, Platform } from 'react-native';
import PropTypes from 'prop-types';

import { Loading } from '@gqlapp/look-client-react-native';
import settings from '@gqlapp/config';

import ModalNotify from '../components/ModalNotify';

const { protocol, port, hostname } = url.parse(__API_URL__);
const serverUrl = `${protocol}//${
  hostname === 'localhost' ? url.parse(Constants.manifest.bundleUrl).hostname : hostname
}${port ? ':' + port : ''}`;

const imageDir = FileSystem.cacheDirectory + 'ImagePicker/';
const allowImages = settings.chat.allowImages;

const withImage = Component => {
  const WithImage = props => {
    const { messages, t } = props;

    const [notify, setNotify] = useState(null);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
      if (allowImages && messages) {
        checkImages(messages.edges);
      }
    }, [messages]);

    const checkImages = edges => {
      const newEdges = edges.filter(
        ({ node: { path, image, quotedMessage } }) => (path && !image) || (quotedMessage.path && !quotedMessage.image)
      );
      if (newEdges.length) downloadImages(newEdges);
    };

    const downloadImages = async newMessages => {
      const { getInfoAsync, makeDirectoryAsync, readDirectoryAsync, downloadAsync } = FileSystem;
      const { isDirectory } = await getInfoAsync(imageDir);
      if (!isDirectory) await makeDirectoryAsync(imageDir);
      const files = await readDirectoryAsync(imageDir);
      newMessages.forEach(({ node }) => {
        Promise.all(
          [node, node.quotedMessage].map(({ filename, path }) => {
            if (filename && path && !files.includes(filename)) {
              return downloadAsync(serverUrl + '/' + path, imageDir + filename);
            }
          })
        );
      });

      addImagesToEdge(newMessages);
    };

    const addImagesToEdge = newMessages => {
      const newEdges = newMessages.map(msg => {
        const { quotedMessage: quoted, filename } = msg.node;
        const quotedMessage = { ...quoted, image: quoted.filename ? `${imageDir}${quoted.filename}` : null };
        return { ...msg, node: { ...msg.node, quotedMessage, image: filename ? `${imageDir}${filename}` : null } };
      });

      const mergedMsgs = messages.edges.map(msg => {
        return newEdges.find(({ node: { id: newId } }) => msg.node.id === newId) || msg;
      });

      setEdges(mergedMsgs);
    };

    const checkPermission = async (type, skip) => {
      if (skip === Platform.OS) {
        return true;
      }
      const { getAsync, askAsync } = Permissions;
      const { status } = await getAsync(type);
      if (status !== 'granted') {
        const { status } = await askAsync(type);
        return status === 'granted';
      }
      return true;
    };

    const pickImage = async onSend => {
      if (await checkPermission(Permissions.CAMERA_ROLL, 'android')) {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync(settings.chat.image.imagePicker);
        if (!cancelled) {
          const { size } = await FileSystem.getInfoAsync(uri);
          const reg = /[^\\/]*\.\w+$/;
          if (size <= settings.chat.image.maxSize && reg.test(uri)) {
            const type = mime.lookup(uri);
            const name = uri.match(reg)[0];
            const imageData = new ReactNativeFile({ uri, type, name });
            onSend({ attachment: imageData });
          } else {
            setNotify(t('attachment.errorMsg'));
          }
        }
      } else {
        setNotify(t('permission.errorMsg'));
      }
    };

    const renderModal = () => {
      if (notify) {
        return <ModalNotify notify={notify} callback={() => setNotify(null)} />;
      }
    };

    const newProps = {
      allowImages,
      messages: edges.length ? { ...messages, edges } : messages,
      pickImage
    };

    return (
      <View style={{ flex: 1 }}>
        {edges.length > 0 ? (
          <>
            <Component {...props} {...newProps} />
            {renderModal()}
          </>
        ) : (
          <Loading text="Loading..." />
        )}
      </View>
    );
  };

  WithImage.propTypes = {
    messages: PropTypes.object,
    t: PropTypes.func
  };

  return WithImage;
};

export default withImage;
