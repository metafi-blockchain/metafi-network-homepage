docker buildx build --platform linux/amd64 -t metafi/metafi-landing-page:0.1.6 --load .


docker buildx build --platform linux/amd64,linux/arm64 -t metafi/metafi-landing-page:0.1.6 --push .


docker push metafi/metafi-landing-page:0.1.6