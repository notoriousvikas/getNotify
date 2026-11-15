
export const rateLimiter =(limiter)=>{
   return async(req,res,next)=>{
      try {
           const identifier = req.ip;
         const result = await limiter.limit(identifier);

           res.set({
                "X-RateLimit-Limit": result.limit,
                "X-RateLimit-Remaining": result.remaining,
                "X-RateLimit-Reset": result.reset,
            });
            if(!result.success){
                throw new Error("try after some time ")
            }
            next();
      } catch (error) {
         console.error("Rate limiter error:", error);

            // Fail closed for sensitive endpoints.
            // Handle infrastructure errors according to your policy.
            return res.status(503).json({
                success: false,
                message: "Service temporarily unavailable",
            });
      }
        
   }
}