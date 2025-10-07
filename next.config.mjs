/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				hostname: "savannahtrail.s3.us-east-2.amazonaws.com",
				pathname: "**"
			},
			{
				hostname: "example.com",
				pathname: "**"
			}
		]
	}
};

export default nextConfig;
