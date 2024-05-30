variable "bucket_name" {
  description = "Name of the S3 bucket"
  type = string
}

variable "bucket_acl" {
  description = "Access Control List setting for the S3 bucket"
  type = string
  default = "private"
}

# VARIABLE: in terraform is the same as Programming Language