output "bucket_id" {
  value       = aws_s3_bucket.microsample_resource.id
  description = "ID of the S3 bucket"
}


# OUTPUT: used for passing or exposing the certain value to other part of your configuration
