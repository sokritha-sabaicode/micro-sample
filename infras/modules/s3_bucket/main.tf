# S3 Bucket Creation
resource "aws_s3_bucket" "microsample_resource" {
  bucket = var.bucket_name
}

# ACL Configuration (who can access object in the bucket)
resource "aws_s3_bucket_acl" "microsample_resource" {
  bucket = aws_s3_bucket.microsample-resource.id
  acl    = var.bucket_acl
}


# Bucket Policy
resource "aws_s3_bucket_policy" "microsampel_resource_policy" {
  bucket = aws_s3_bucket.microsample-resource.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          AWS = "arn:aws:iam::ACCOUNT-ID:role/ROLE-NAME"
        }
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "arn:aws:s3:::${aws_s3_bucket.my_bucket.bucket}/*"
      }
    ]
  })
}
