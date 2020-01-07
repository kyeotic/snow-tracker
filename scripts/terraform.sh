#!/usr/bin/env bash

_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
. "${_dir}/common.sh"

# DEPENDS ON THE FOLLOWING ENVIRONMENT VARIABLES BEING SET BY CI
: "${TERRAFORM_STATE_BUCKET?Unset variable}"
: "${TERRAFORM_KEY?Unset variable}"

function terraform_preinit() {
  terraform init \
    -backend-config="bucket=${TERRAFORM_STATE_BUCKET}" \
    -backend-config="region=${TF_VAR_region:-us-west-2}" \
    -backend-config="key=${TERRAFORM_KEY}" \
    -backend-config="encrypt=true"
}

function terraform_init() {
  rm -rf "${_dir}/../infrastructure/.terraform"
  WORKSPACE=${1:-"default"}
  terraform_preinit
  # If the workspace doesn not exist, create it.
  if ! terraform workspace select ${WORKSPACE}; then
      terraform workspace new ${WORKSPACE}
  fi
  terraform_preinit
}

function terraform_cmd () {
  cp "${_dir}/../.env" "${_dir}/../infrastructure/terraform.tfvars"
  terraform $1
  rm "${_dir}/../infrastructure/terraform.tfvars"
}

function terraform_apply () {
  terraform_cmd "apply -auto-approve"
}

function terraform_destroy () {
  terraform_cmd "destory"
}

function terraform_plan () {
  terraform_cmd "plan"
}