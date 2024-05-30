# Fetch the AMI up-to-date from SSM
data "aws_ssm_parameter" "amzn2_ami" {
  name = "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2"
}

# EC2 creation
resource "aws_instance" "app_instance" {
  ami           = data.aws_ssm_parameter.amzn2_ami.value
  instance_type = var.ec2_instance_type

  tags = {
    Name = var.ec2_tag_name
  }
}