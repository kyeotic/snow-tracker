#-------------------------------------------
# Required variables (do not add defaults here!)
#-------------------------------------------

#-------------------------------------------
# Configurable variables
#-------------------------------------------
variable "region" {
  default = "us-west-2"
}

variable "domain_name" {
  default = "snow.kye.dev"
}

variable "domain_target" {
  default = "snow.net.key.dev"
}

variable "zone_name" {
  default = "kye.dev"
}
