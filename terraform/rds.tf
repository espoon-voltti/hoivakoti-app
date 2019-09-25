module "rds" {
  name          = "${var.name}"
  db_replicated = "${terraform.workspace == "prod" ? true : false }"
  businessUnit  = "${var.businessUnit}"
  source        = "git@github.com:espoon-voltti/voltti-infra.git//terraform/modules/voltti-rds"
}
