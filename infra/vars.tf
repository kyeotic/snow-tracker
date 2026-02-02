#-------------------------------------------
# Required variables (do not add defaults here!)
#-------------------------------------------

#-------------------------------------------
# Configurable variables
#-------------------------------------------
variable "region" {
  default = "us-west-2"
}

variable "hostname" {
  default = "snow"
}

variable "zone_name" {
  default = "kye.dev"
}

variable "cloudflare_account_name" {
  default = "tim@kye.dev"
}

variable "tunnel_service_url" {
  description = "URL the tunnel points to Tunnel target server"
  default     = "http://snow-tracker:3000"
}

#-------------------------------------------
# Outputs
#-------------------------------------------

output "tunnel_token" {
  value     = cloudflare_zero_trust_tunnel_cloudflared.snow.tunnel_token
  sensitive = true
}