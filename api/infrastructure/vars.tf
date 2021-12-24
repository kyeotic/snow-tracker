#-------------------------------------------
# Required variables (do not add defaults here!)
#-------------------------------------------

variable app_namespace {}
variable site_domain {}
variable site_target {}

#-------------------------------------------
# Configurable variables
#-------------------------------------------
variable "region" {
  default = "us-west-2"
}

variable api_lambda_file {
  default = "../../build/server.zip"
}

variable API_DOMAIN {
  default = ""
}

#-------------------------------------------
# Interpolated Values
#-------------------------------------------
locals {
  api_lambda_name   = "${var.app_namespace}-api"
  api_gateway_name  = "${var.app_namespace}-api"
  lambda_role_name  = "${var.app_namespace}_exec"
  hosted_zone_name  = join(".", slice(split(".", var.site_domain), 1, length(split(".", var.site_domain))))
  api_domain        = "api-${var.site_domain}"
  cloufront_domains = [var.site_domain]
  account_id        = data.aws_caller_identity.current.account_id
  tags = {
    Namespace = var.app_namespace
  }
}