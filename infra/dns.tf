data "aws_route53_zone" "domain" {
  name = "${var.zone_name}."
}


resource "aws_route53_record" "target" {
  name    = var.domain_name
  zone_id = data.aws_route53_zone.domain.zone_id
  type    = "CNAME"
  ttl     = 300
  records = [var.domain_target]
}
