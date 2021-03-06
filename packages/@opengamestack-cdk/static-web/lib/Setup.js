"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const cloudfront = require("@aws-cdk/aws-cloudfront");
const route53 = require("@aws-cdk/aws-route53");
const route53Targets = require("@aws-cdk/aws-route53-targets");
class Setup extends core.Construct {
    constructor(scope, id, props) {
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
        let aRecordCount = 1;
        props.route53RecordNames.forEach(n => {
            const aRecord = new route53.ARecord(this, `ARecord${aRecordCount++}`, {
                recordName: n,
                zone: this.hostedZone,
                target: route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(this.distribution))
            });
            this.aRecords.push(aRecord);
        });
    }
}
exports.Setup = Setup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2V0dXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJTZXR1cC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUN0QyxzQ0FBc0M7QUFDdEMsc0RBQXNEO0FBQ3RELGdEQUFnRDtBQUNoRCwrREFBK0Q7QUFvQi9ELE1BQWEsS0FBTSxTQUFRLElBQUksQ0FBQyxTQUFTO0lBT3JDLFlBQVksS0FBcUIsRUFBRSxFQUFVLEVBQUUsS0FBaUI7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLElBQUksR0FBRyxDQUFDO2dCQUNWLGNBQWMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO2dCQUNwQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUM7Z0JBQ3JCLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FBQzthQUN4QixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQ3hDLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVTtZQUM1QixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLElBQUksRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDekMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsWUFBWTtZQUMxRSxvQkFBb0IsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxZQUFZO1NBQzdFLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUMvRSxhQUFhLEVBQUU7Z0JBQ1g7b0JBQ0ksa0JBQWtCLEVBQUU7d0JBQ2hCLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUF1Qjt3QkFDL0Msb0JBQW9CLEVBQUUsVUFBVSxDQUFDLG9CQUFvQixDQUFDLFNBQVM7cUJBQ2xFO29CQUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLENBQUM7aUJBQzNDO2FBQ0o7WUFDRCxVQUFVLEVBQUUsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZTtZQUMzRyxvQkFBb0IsRUFBRSxVQUFVLENBQUMsb0JBQW9CLENBQUMsaUJBQWlCO1lBQ3ZFLGlCQUFpQixFQUFFO2dCQUNmLE9BQU8sRUFBRSxLQUFLLENBQUMscUJBQXFCO2dCQUNwQyxLQUFLLEVBQUU7b0JBQ0gsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLFVBQVU7b0JBQ25DLGdCQUFnQixFQUFFLFVBQVU7aUJBQy9CO2FBQ0o7U0FDSixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUM5RSxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsUUFBUSxFQUFFLEtBQUssQ0FBQyxjQUFjO1NBQ2pDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO1FBQ25CLElBQUksWUFBWSxHQUFHLENBQUMsQ0FBQztRQUNyQixLQUFLLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsVUFBVSxZQUFZLEVBQUUsRUFBRSxFQUFFO2dCQUNsRSxVQUFVLEVBQUUsQ0FBQztnQkFDYixJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVU7Z0JBQ3JCLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDakcsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDO0NBQ0o7QUE3REQsc0JBNkRDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcclxuaW1wb3J0ICogYXMgY2xvdWRmcm9udCBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWRmcm9udCc7XHJcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xyXG5pbXBvcnQgKiBhcyByb3V0ZTUzVGFyZ2V0cyBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1My10YXJnZXRzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgRGVwbG95bWVudFN0YWNrUHJvcHMgZXh0ZW5kcyBjb3JlLlN0YWNrUHJvcHMge1xyXG4gICAgYnVja2V0OiBzMy5CdWNrZXQ7XHJcbiAgICBkaXN0cmlidXRpb246IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbjtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTZXR1cFByb3BzIHtcclxuICAgIGJ1Y2tldE5hbWU6IHN0cmluZztcclxuICAgIGJ1Y2tldENvcnM/OiBib29sZWFuO1xyXG4gICAgYnVja2V0SW5kZXg/OiBzdHJpbmc7XHJcbiAgICBidWNrZXRFcnJvcj86IHN0cmluZztcclxuICAgIGFjbUNlcnRBcm46IHN0cmluZztcclxuICAgIGhvc3RlZFpvbmVJZDogc3RyaW5nO1xyXG4gICAgaG9zdGVkWm9uZU5hbWU6IHN0cmluZztcclxuICAgIHJvdXRlNTNSZWNvcmROYW1lczogc3RyaW5nW107XHJcbiAgICBjbG91ZEZyb250RG9tYWluTmFtZXM6IHN0cmluZ1tdO1xyXG4gICAgY2xvdWRGcm9udFByaWNlQ2xhc3M/OiBjbG91ZGZyb250LlByaWNlQ2xhc3M7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBTZXR1cCBleHRlbmRzIGNvcmUuQ29uc3RydWN0IHtcclxuXHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgYnVja2V0OiBzMy5CdWNrZXQ7XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgZGlzdHJpYnV0aW9uOiBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb247XHJcbiAgICBwdWJsaWMgcmVhZG9ubHkgaG9zdGVkWm9uZTogcm91dGU1My5JSG9zdGVkWm9uZTtcclxuICAgIHB1YmxpYyByZWFkb25seSBhUmVjb3Jkczogcm91dGU1My5BUmVjb3JkW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvcmUuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2V0dXBQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvcnMgPSBbe1xyXG4gICAgICAgICAgICBhbGxvd2VkTWV0aG9kczogW3MzLkh0dHBNZXRob2RzLkdFVF0sXHJcbiAgICAgICAgICAgIGFsbG93ZWRPcmlnaW5zOiBbJyonXSxcclxuICAgICAgICAgICAgYWxsb3dlZEhlYWRlcnM6IFsnKiddXHJcbiAgICAgICAgfV07XHJcblxyXG4gICAgICAgIHRoaXMuYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnQnVja2V0Jywge1xyXG4gICAgICAgICAgICBidWNrZXROYW1lOiBwcm9wcy5idWNrZXROYW1lLFxyXG4gICAgICAgICAgICBwdWJsaWNSZWFkQWNjZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICBjb3JzOiBwcm9wcy5idWNrZXRDb3JzID8gY29ycyA6IHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgd2Vic2l0ZUluZGV4RG9jdW1lbnQ6IHByb3BzLmJ1Y2tldEluZGV4ID8gcHJvcHMuYnVja2V0SW5kZXggOiAnaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiBwcm9wcy5idWNrZXRFcnJvciA/IHByb3BzLmJ1Y2tldEVycm9yIDogJ2luZGV4Lmh0bWwnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCAnRGlzdHJpYnV0aW9uJywge1xyXG4gICAgICAgICAgICBvcmlnaW5Db25maWdzOiBbXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tT3JpZ2luU291cmNlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbWFpbk5hbWU6IHRoaXMuYnVja2V0LmJ1Y2tldFdlYnNpdGVEb21haW5OYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW5Qcm90b2NvbFBvbGljeTogY2xvdWRmcm9udC5PcmlnaW5Qcm90b2NvbFBvbGljeS5IVFRQX09OTFlcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGJlaGF2aW9yczogW3sgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUgfV1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgcHJpY2VDbGFzczogcHJvcHMuY2xvdWRGcm9udFByaWNlQ2xhc3MgPyBwcm9wcy5jbG91ZEZyb250UHJpY2VDbGFzcyA6IGNsb3VkZnJvbnQuUHJpY2VDbGFzcy5QUklDRV9DTEFTU18xMDAsXHJcbiAgICAgICAgICAgIHZpZXdlclByb3RvY29sUG9saWN5OiBjbG91ZGZyb250LlZpZXdlclByb3RvY29sUG9saWN5LlJFRElSRUNUX1RPX0hUVFBTLFxyXG4gICAgICAgICAgICB2aWV3ZXJDZXJ0aWZpY2F0ZToge1xyXG4gICAgICAgICAgICAgICAgYWxpYXNlczogcHJvcHMuY2xvdWRGcm9udERvbWFpbk5hbWVzLFxyXG4gICAgICAgICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgICAgICAgICBhY21DZXJ0aWZpY2F0ZUFybjogcHJvcHMuYWNtQ2VydEFybixcclxuICAgICAgICAgICAgICAgICAgICBzc2xTdXBwb3J0TWV0aG9kOiAnc25pLW9ubHknXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5ob3N0ZWRab25lID0gcm91dGU1My5Ib3N0ZWRab25lLmZyb21Ib3N0ZWRab25lQXR0cmlidXRlcyh0aGlzLCAnSG9zdGVkWm9uZScsIHtcclxuICAgICAgICAgICAgaG9zdGVkWm9uZUlkOiBwcm9wcy5ob3N0ZWRab25lSWQsXHJcbiAgICAgICAgICAgIHpvbmVOYW1lOiBwcm9wcy5ob3N0ZWRab25lTmFtZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuYVJlY29yZHMgPSBbXTtcclxuICAgICAgICBsZXQgYVJlY29yZENvdW50ID0gMTtcclxuICAgICAgICBwcm9wcy5yb3V0ZTUzUmVjb3JkTmFtZXMuZm9yRWFjaChuID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYVJlY29yZCA9IG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgYEFSZWNvcmQke2FSZWNvcmRDb3VudCsrfWAsIHtcclxuICAgICAgICAgICAgICAgIHJlY29yZE5hbWU6IG4sXHJcbiAgICAgICAgICAgICAgICB6b25lOiB0aGlzLmhvc3RlZFpvbmUsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhuZXcgcm91dGU1M1RhcmdldHMuQ2xvdWRGcm9udFRhcmdldCh0aGlzLmRpc3RyaWJ1dGlvbikpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmFSZWNvcmRzLnB1c2goYVJlY29yZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG59Il19