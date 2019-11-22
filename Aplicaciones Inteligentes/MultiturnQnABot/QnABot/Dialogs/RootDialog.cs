using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.AI.QnA;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Schema;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace QnABot.Dialogs
{
    public class RootDialog : ComponentDialog
    {
        private readonly QnAMaker _qnAMaker;

        public RootDialog(QnAMaker qnAMaker)
        {
            _qnAMaker = qnAMaker;
            AddDialog(new WaterfallDialog(
                    nameof(WaterfallDialog),
                    new WaterfallStep[]
                    {
                        GetQnAAnswer,
                        ConstructActivity,
                        PromptQnAAnswer,
                        Restart
                    }
                ));
        }

        /// <summary>
        /// Gets QnAResults with QnAOptions if exist
        /// </summary>
        /// <param name="stepContext"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        private async Task<DialogTurnResult> GetQnAAnswer(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            QueryResult[] queryResults = await _qnAMaker.GetAnswersAsync(stepContext.Context);

            return await stepContext.NextAsync(queryResults, cancellationToken);
        }

        /// <summary>
        /// Based in QueryResult, creates the activity for the next step
        /// Based in QueryResult set if Dialog should continue or not
        /// </summary>
        /// <param name="stepContext"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        private async Task<DialogTurnResult> ConstructActivity(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            Activity message = null;
            if (stepContext.Result is QueryResult[] queryResults && queryResults.Any())
            {
                if (queryResults[0].Context.Prompts.Any())
                {
                    IEnumerable<string> prompts = queryResults[0].Context.Prompts.Select(prompt=>prompt.DisplayText);
                    message = MessageFactory.SuggestedActions(prompts, text: queryResults[0].Answer) as Activity;
                    stepContext.ActiveDialog.State["ShouldContinue"] = true;
                }
                else
                {
                    message = MessageFactory.Text(queryResults[0].Answer) as Activity;
                    stepContext.ActiveDialog.State["ShouldContinue"] = false;
                }
            }
            else
            {
                message = MessageFactory.Text("No he encontrado una buena respuesta para eso") as Activity;
            }
            return await stepContext.NextAsync(message);
        }


        /// <summary>
        /// Print Activity
        /// </summary>
        /// <param name="stepContext"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        private async Task<DialogTurnResult> PromptQnAAnswer(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            await stepContext.Context.SendActivityAsync(stepContext.Result as Activity);
            if (ShouldContinue(stepContext))
            {
                return new DialogTurnResult(DialogTurnStatus.Waiting);
            }
            return await stepContext.NextAsync();
        }

        /// <summary>
        /// Restart this waterfall just in case 
        /// </summary>
        /// <param name="stepContext"></param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        private async Task<DialogTurnResult> Restart(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            if (ShouldContinue(stepContext))
            {
                return await stepContext.ReplaceDialogAsync(nameof(WaterfallDialog));
            }
            return await stepContext.EndDialogAsync();
        }

        private bool ShouldContinue(WaterfallStepContext stepContext)
        {
            stepContext.ActiveDialog.State.TryGetValue("ShouldContinue", out object shouldContinueObj);
            return (shouldContinueObj is bool shouldContinue && shouldContinue);
        }

    }
}
