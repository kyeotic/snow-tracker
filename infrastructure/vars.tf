variable "region" {
  default = "us-west-2"
}

variable api_lambda_file {
  default = "../build/server.zip"
}

variable APP_NAMESPACE {}
variable SITE_DOMAIN {}
variable API_DOMAIN {
  default = ""
}
variable AIRTABLE_KEY {}
variable AIRTABLE_DIET_BASE_ID {}