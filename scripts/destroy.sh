#!/usr/bin/env bash

_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "${_dir}/common.sh"
. "${_dir}/terraform.sh"

pushd "${_dir}/../server"
npm run build
popd

aws s3 rm --recursive s3://$SITE_DOMAIN
pushd "${_dir}/../infrastructure"
terraform_init
terraform_destroy
popd
