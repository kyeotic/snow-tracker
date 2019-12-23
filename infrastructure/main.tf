
provider "aws" {
  region = var.region
}

data "aws_caller_identity" "current" {}

terraform {
  backend "s3" {}
  required_version = ">= 0.12"
}

locals {
  api_lambda_name   = "${var.APP_NAMESPACE}-api"
  api_gateway_name  = "${var.APP_NAMESPACE}-api"
  lambda_role_name  = "${var.APP_NAMESPACE}_exec"
  hosted_zone_name  = join(".", slice(split(".", local.site_domain), 1, length(split(".", local.site_domain))))
  site_domain       = var.SITE_DOMAIN
  api_domain        = "api-${local.site_domain}"
  cloufront_domains = [local.site_domain]
  account_id        = data.aws_caller_identity.current.account_id
  tags = {
    Namespace = var.APP_NAMESPACE
  }
}
