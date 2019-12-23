#Lambda function
resource "aws_lambda_function" "api" {
  filename         = var.api_lambda_file
  function_name    = local.api_lambda_name
  handler          = "api.handler"
  timeout          = 30
  memory_size      = 512
  role             = aws_iam_role.lambda_execution.arn
  runtime          = "nodejs10.x"
  source_code_hash = filebase64sha256(var.api_lambda_file)
  tags             = local.tags

  environment {
    variables = {
      AIRTABLE_KEY          = var.AIRTABLE_KEY
      AIRTABLE_DIET_BASE_ID = var.AIRTABLE_DIET_BASE_ID
    }
  }
}

resource "aws_iam_role" "lambda_execution" {
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

resource "aws_iam_role_policy" "lambda_execution" {
  name   = "lambda_execution"
  role   = aws_iam_role.lambda_execution.id
  policy = data.aws_iam_policy_document.lambda_execution.json
}

data "aws_iam_policy_document" "lambda_execution" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
  statement {
    effect = "Allow"
    actions = [
      "lambda:GetFunctionConfiguration",
      "lambda:InvokeAsync",
      "lambda:InvokeFunction"
    ]
    resources = [
      "arn:aws:lambda:*:${local.account_id}:function:${local.api_lambda_name}*",
      "arn:aws:sts::${local.account_id}:assumed-role/${aws_iam_role.lambda_execution.name}/${local.api_lambda_name}"
    ]
  }
}