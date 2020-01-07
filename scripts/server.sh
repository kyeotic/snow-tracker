#!/usr/bin/env bash

_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "${_dir}/common.sh"
. "${_dir}/terraform.sh"

pushd "${_dir}/../server"
if [ "$CI" = true ] ; then
    npm ci
fi
npm run build
popd

pushd "${_dir}/../infrastructure"
terraform_init
terraform_apply
popd
