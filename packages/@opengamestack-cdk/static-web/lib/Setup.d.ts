import * as core from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
export interface DeploymentStackProps extends core.StackProps {
    bucket: s3.Bucket;
    distribution: cloudfront.CloudFrontWebDistribution;
}
export interface SetupProps {
    bucketName: string;
    bucketCors?: boolean;
    bucketIndex?: string;
    bucketError?: string;
    acmCertArn: string;
    hostedZoneId: string;
    hostedZoneName: string;
    route53RecordName: string;
    cloudFrontDomainNames: string[];
    cloudFrontPriceClass?: cloudfront.PriceClass;
}
export declare class Setup extends core.Construct {
    readonly bucket: s3.Bucket;
    readonly distribution: cloudfront.CloudFrontWebDistribution;
    readonly hostedZone: route53.IHostedZone;
    readonly aRecord: route53.ARecord;
    constructor(scope: core.Construct, id: string, props: SetupProps);
}
