# Dynasty Tagifier
Dynasty Tagifier is a **[Tampermonkey](https://tampermonkey.net/)** userscript for use on [dynasty-scans.com](https://dynasty-scans.com) to add functionality not present that may be beneficial. As the name suggestions, it focuses on functionality regarding [site tags](https://dynasty-scans.com/tags).

### Features
**Forum Tagger** :white_check_mark:
> Forum Tagger scans forum post `Tag` objects for valid tags and turns them into clickable links to each tag's page. 
> *(For the ~~nerds~~, it does this dynamically pulling and parsing Dynasty's JSON and then scanning all \<code\> elements.)*

**Tag Suggestions Switcher (TSS)** :white_check_mark:
> TSS puts a controller bar on the [tag suggestions status page](https://dynasty-scans.com/user/suggestions) (link requires account) so users can select the type of tag suggestions (`Approved`, `Rejected`, or `Pending`) the page displays, whether a single type, a mixture, or all of them.

**Forum Stats Number Shortener (FSNS)** :white_check_mark:
> FSNS converts the stats numbers on the Forum navigation pages for views and posts to automatically shorten, round anything over 1000 and insert the appropriate abbreviation ("K" or "M") after the shortened number.
