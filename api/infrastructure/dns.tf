data "aws_route53_zone" "domain" {
  name = "${local.hosted_zone_name}."
}

provider "aws" {
  region = "us-east-1"
  alias  = "certs"
}

module "cert" {
  source = "github.com/azavea/terraform-aws-acm-certificate?ref=3.0.0"

  providers = {
    aws.acm_account     = aws.certs
    aws.route53_account = aws
  }

  domain_name               = local.api_domain
  hosted_zone_id            = data.aws_route53_zone.domain.zone_id
  validation_record_ttl     = "60"
}

#-------------------------------------------
# Site
#-------------------------------------------

resource "aws_route53_record" "site" {
  name    = var.site_domain
  zone_id = data.aws_route53_zone.domain.zone_id
  type    = "CNAME"
  ttl     = 300

  records = [var.site_target]
}


#-------------------------------------------
# API
#-------------------------------------------

resource "aws_route53_record" "api" {
  name    = aws_api_gateway_domain_name.api_domain.domain_name
  zone_id = data.aws_route53_zone.domain.zone_id
  type    = "A"

  alias {
    name                   = aws_api_gateway_domain_name.api_domain.cloudfront_domain_name
    zone_id                = aws_api_gateway_domain_name.api_domain.cloudfront_zone_id
    evaluate_target_health = false
  }
}

# Api Gateway Custom Domain
resource "aws_api_gateway_domain_name" "api_domain" {
  domain_name     = local.api_domain
  certificate_arn = module.cert.arn
  security_policy = "TLS_1_2"
}

output "domain" {
  value = "https://${aws_api_gateway_domain_name.api_domain.domain_name}"
}

