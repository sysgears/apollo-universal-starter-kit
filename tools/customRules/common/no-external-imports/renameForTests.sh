#!/usr/bin/env bash
if [ "$1" == "commandFirst" ]
then
    sed -i 's/node_modules/test_node_modules/g' ../common/no-external-imports/index.js;
else
 sed -i 's/test_node_modules/node_modules/g' ../common/no-external-imports/index.js;
fi
