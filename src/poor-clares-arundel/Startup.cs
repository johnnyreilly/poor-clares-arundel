﻿using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Rewrite;
using Microsoft.AspNetCore.Rewrite.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using PoorClaresArundel.Services;

namespace PoorClaresArundel
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
                .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfigurationRoot Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add framework services.
            services.AddMvc();

            services.Configure<ApplicationSettings>(Configuration);

            services.AddScoped<IMailer, Mailer>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                loggerFactory.AddDebug();
                app.UseDeveloperExceptionPage();
                // app.UseBrowserLink();
            }
            else
            {
                loggerFactory.AddAzureWebAppDiagnostics();
                app.UseExceptionHandler("/Home/Error"); // TODO: Replace with something else; this URL doesn't hit anything now
            }

            app.UseMvc();

            app.UseDefaultFiles(); // Means root URL requests will get index.html as well

            // Fallback routing for SPA; 
            // serve up index.html if a request arrives without a "." in
            // - may need tweaking to allow MVC to work okay
            app.UseRewriter(new RewriteOptions
            {
                Rules = { new RewriteRule(
                    regex: "^[^.]+$" /* Match any URL that does not contain a "." */, 
                    replacement: "/index.html", 
                    stopProcessing: true) 
                }
            });

            app.UseStaticFiles();

        }
    }
}
