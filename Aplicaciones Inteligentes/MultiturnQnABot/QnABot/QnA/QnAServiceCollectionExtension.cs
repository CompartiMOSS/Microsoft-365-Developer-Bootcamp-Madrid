using Microsoft.Bot.Builder.AI.QnA;
using Microsoft.Extensions.DependencyInjection.Extensions;
using System;

namespace Microsoft.Extensions.DependencyInjection
{
    public static class QnAServiceCollectionExtension
    {
        public static IServiceCollection AddQnAService(this IServiceCollection services, Action<QnAMakerEndpoint> setup)
        {
            var qnAMakerEndpoint = new QnAMakerEndpoint();

            setup(qnAMakerEndpoint);

            services.TryAddSingleton<QnAMakerEndpoint>(qnAMakerEndpoint);
            services.TryAddSingleton<QnAMaker>();

            return services;
        }
    }
}