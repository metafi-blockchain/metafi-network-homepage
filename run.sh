# docker build -t metafi/metafi-landing-page:1.0.2 .

# docker buildx build \
#   --platform linux/amd64 \
#   -t metafi/metafi-landing-page:1.0.2 \
#   --push \
#   .

# docker tag metafi/metafi-landing-page:1.0.2 metafi/metafi-landing-page:latest
docker build -t metafi/metafi-landing-page:1.0.5 .

docker push metafi/metafi-landing-page:1.0.5
docker push metafi/metafi-landing-page:latest