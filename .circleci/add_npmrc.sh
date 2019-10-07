#!/bin/bash -eu

cat << EOF > .npmrc
@voltti:registry=https://npm.sst.espoon-voltti.fi/
//npm.sst.espoon-voltti.fi/:_authToken="$(echo $VERDACCIO_TOKEN)"
//npm.sst.espoon-voltti.fi/:always-auth=true
EOF
