module "ec2_instance" {
  source = "../../modules/ec2"
  ec2_tag_name = "Microsample-DevInstance"
}