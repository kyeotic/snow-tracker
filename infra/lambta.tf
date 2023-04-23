locals {
  lambda_zip_file = "lambda.zip"
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "lambda.py"
  output_path = local.lambda_zip_file
}

#Lambda function
resource "aws_lambda_function" "watcher" {
  function_name    = local.api_lambda_name
  handler          = "lambda.handler"
  timeout          = 10
  memory_size      = 128
  role             = aws_iam_role.lambda.arn
  runtime          = "python3.10"
  filename         = local.lambda_zip_file
  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      WATCH_URL = var.domain_name
    }
  }
}

resource "aws_iam_role" "lambda" {
  name               = local.lambda_role_name
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRole"]
    principals {
      type = "Service"
      identifiers = [
        "lambda.amazonaws.com",
      ]
    }
  }
}

resource "aws_iam_role_policy_attachment" "lambda-basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = data.aws_iam_policy.ReadOnlyAccess.arn
}

data "aws_iam_policy" "basic" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}


# Create our schedule
resource "aws_cloudwatch_event_rule" "every_2_minutes" {
  name                = "every-2-minutes"
  description         = "Fires every 2 minutes"
  schedule_expression = "rate(2 minutes)"
}

# Trigger our lambda based on the schedule
resource "aws_cloudwatch_event_target" "trigger_lambda_on_schedule" {
  rule      = aws_cloudwatch_event_rule.every_2_minutes.name
  target_id = "lambda"
  arn       = aws_lambda_function.watcher.arn
}
