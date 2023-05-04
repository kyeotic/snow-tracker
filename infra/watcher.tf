module "watcher" {
  source      = "github.com/kyeotic/tf-domain-heartbeat"
  lambda_name = "snow-tracker-watcher"
  watch_url   = "${var.domain_name}/update"
}
