import * as core from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';

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
    route53RecordNames: string[];
    cloudFrontDomainNames: string[];
    cloudFrontPriceClass?: cloudfront.PriceClass;
}

export class Setup extends core.Construct {

    public readonly bucket: s3.Bucket;
    public readonly distribution: cloudfront.CloudFrontWebDistribution;
    public readonly hostedZone: route53.IHostedZone;
    public readonly aRecords: route53.ARecord[];

    constructor(scope: core.Construct, id: string, props: SetupProps) {
        super(scope, id);

        const cors = [{
            allowedMethods: [s3.HttpMethods.GET],
            allowedOrigins: ['*'],
            allowedHeaders: ['*']
        }];

        this.bucket = new s3.Bucket(this, 'Bucket', {
            bucketName: props.bucketName,
            publicReadAccess: true,
            cors: props.bucketCors ? cors : undefined,
            websiteIndexDocument: props.bucketIndex ? props.bucketIndex : 'index.html',
            websiteErrorDocument: props.bucketError ? props.bucketError : 'index.html'
        });

        this.distribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
            originConfigs: [
                {
                    customOriginSource: {
                        domainName: this.bucket.bucketWebsiteDomainName,
                        originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY
                    },
                    behaviors: [{ isDefaultBehavior: true }]
                }
            ],
            priceClass: props.cloudFrontPriceClass ? props.cloudFrontPriceClass : cloudfront.PriceClass.PRICE_CLASS_100,
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            viewerCertificate: {
                aliases: props.cloudFrontDomainNames,
                props: {
                    acmCertificateArn: props.acmCertArn,
                    sslSupportMethod: 'sni-only'
                }
            }
        });

        this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
            hostedZoneId: props.hostedZoneId,
            zoneName: props.hostedZoneName
        });
        this.aRecords = [];
        props.route53RecordNames.forEach(n => {
            const aRecord = new route53.ARecord(this, 'ARecord', {
                recordName: n,
                zone: this.hostedZone,
                target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(this.distribution))
            });
            this.aRecords.push(aRecord);
        });

    }
}