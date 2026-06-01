class ProxyIPMiddleware:
    """
    Middleware to correctly set REMOTE_ADDR when behind a reverse proxy like Render.
    This ensures rate limiting targets the actual user's IP instead of the Render load balancer.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            # X-Forwarded-For can be a comma-separated list of IPs. The first is the client.
            request.META['REMOTE_ADDR'] = x_forwarded_for.split(',')[0].strip()
        return self.get_response(request)
