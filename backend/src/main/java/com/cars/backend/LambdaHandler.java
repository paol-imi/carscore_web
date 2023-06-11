package com.cars.backend;

import com.amazonaws.serverless.exceptions.ContainerInitializationException;
import com.amazonaws.serverless.proxy.model.AwsProxyRequest;
import com.amazonaws.serverless.proxy.model.AwsProxyResponse;
import com.amazonaws.serverless.proxy.spring.SpringBootLambdaContainerHandler;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import java.util.Random;

public class LambdaHandler implements RequestHandler<AwsProxyRequest, AwsProxyResponse> {
    public static LambdaLogger logger = null;
    private static SpringBootLambdaContainerHandler<AwsProxyRequest, AwsProxyResponse> handler;

    static {
        try {
            handler = SpringBootLambdaContainerHandler.getAwsProxyHandler(BackendApplication.class);
        } catch (ContainerInitializationException e) {
            // if we fail here. We re-throw the exception to force another cold start
            e.printStackTrace();
            throw new RuntimeException("Could not initialize Spring Boot Application", e);
        }
    }

    @Override
    public AwsProxyResponse handleRequest(AwsProxyRequest awsProxyRequest, Context context) {
        logger = context.getLogger();

        logger.log("REQUEST Method:" + awsProxyRequest.getHttpMethod());
        logger.log("REQUEST Path:" + awsProxyRequest.getPath());
        logger.log("REQUEST Resource:" + awsProxyRequest.getResource());
        logger.log("ENVIRONMENT VARIABLES: " + System.getenv().toString());

        try {
            AwsProxyResponse real_response = handler.proxy(awsProxyRequest, context);
            logger.log("RESPONSE code"+ real_response.getStatusCode());
            logger.log("RESPONSE body"+ real_response.getBody());

            return real_response;
        } catch (Exception e){
            logger.log("ERROR - " + e);

            // Instance of random class
            Random rand = new Random();
            int int_random = rand.nextInt();

            AwsProxyResponse response = new AwsProxyResponse();

            response.setStatusCode(200);
            response.setBody("HI! " + int_random);

            return response;
        }
    }
}
