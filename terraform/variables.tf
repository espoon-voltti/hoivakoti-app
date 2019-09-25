# Common, organizational hierarchy specifics
variable "region" {
  description = "The AWS region running the stack"
  default     = "eu-west-1"
}

variable "name" {
  description = "The name of the product/stack"
  default     = "[[PROJECT]]-base"
}

variable "businessUnit" {
  description = "Used for AWS billing"
  default     = "sito"
}

variable "service_name" {
  description = "The name of the product/stack"
  default     = "[[PROJECT]]"
}

# Stack specific configuration

variable "desired_count" {
  description = "Desired amount of service instances running"

  default = {
    dev     = 1
    test    = 1
    staging = 2
    prod    = 2
  }
}

variable "logs_bucket_expiration_days" {
  default = {
    dev     = 30
    test    = 30
    staging = 30
    prod    = 360
  }
}
