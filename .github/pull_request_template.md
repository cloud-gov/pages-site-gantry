## Changes proposed in this pull request:

-
-
-

## Things to check

- For any logging statements, is there any chance that they could be logging sensitive data?
- Are log statements using a logging library with a logging level set? Setting a logging level means that log statements "below" that level will not be written to the output. For example, if the logging level is set to `INFO` and debugging statements are written with `log.debug` or similar, then they won't be written to the otput, which can prevent unintentional leaks of sensitive data.

## Security considerations

[Note the any security considerations here, or make note of why there are none]
