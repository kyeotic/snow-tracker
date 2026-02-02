data "cloudflare_zone" "main" {
  name = var.zone_name
}

resource "cloudflare_record" "snow" {
  zone_id = data.cloudflare_zone.main.id
  name    = var.hostname
  content = "${cloudflare_zero_trust_tunnel_cloudflared.snow.id}.cfargotunnel.com"
  type    = "CNAME"
  proxied = true
}


###########################
# Tunnel
###########################

resource "random_id" "tunnel_secret" {
  byte_length = 32
}

resource "cloudflare_zero_trust_tunnel_cloudflared" "snow" {
  account_id = local.cloudflare_account_id
  name       = "${var.hostname}-tunnel"
  secret     = random_id.tunnel_secret.b64_std
}

resource "cloudflare_zero_trust_tunnel_cloudflared_config" "snow" {
  account_id = local.cloudflare_account_id
  tunnel_id  = cloudflare_zero_trust_tunnel_cloudflared.snow.id

  config {
    ingress_rule {
      hostname = "${var.hostname}.${var.zone_name}"
      service  = var.tunnel_service_url
    }

    ingress_rule {
      service = "http_status:404"
    }
  }
}