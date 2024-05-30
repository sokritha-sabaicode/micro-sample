variable "ec2_instance_type" {
  description = "The instance type of EC2"
  type = string
  default = "t2.micro"
}

variable "ec2_tag_name" {
  description = "The tag name of Ec2"
  type = string
  default = "MicroserviceAppInstance"
}