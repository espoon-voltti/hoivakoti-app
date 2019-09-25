# Terraform remote state configuration
terraform {
  backend "s3" {
    bucket         = "voltti-sst-infra-state"
    profile        = "voltti-sst"
    key            = "[[PROJECT]]-app.tfstate"
    dynamodb_table = "voltti-sst-terraform"
    region         = "eu-west-1"
  }

  required_version = "0.11.8"
}

provider "aws" {
  version = "~> 2.2"
  profile = "voltti-${terraform.workspace}"
  region  = "${var.region}"
}
