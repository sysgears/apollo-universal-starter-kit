export default function addResolvers(obj) {
  obj = addTypeResolvers(obj);

  return obj;
}

function addTypeResolvers(obj) {
  obj.ApiKeyAuth = {
    name: obj => {
      return obj.name;
    },
    key: obj => {
      return obj.key;
    }
  };

  return obj;
}
