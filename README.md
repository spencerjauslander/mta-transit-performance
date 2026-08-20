# mta-transit-performance

## Table of Contents

<ol>
    <li><a href="#desc">Description</a></li>
    <li><a href="#dca">Data Cleaning & Analysis</a></li>
    <li><a href="#DB">Power BI Dashboard</a></li>
    <li><a href="#bespoke">Interactive Dashboard (Bespoke Web App)</a></li>
    <li><a href="#conclu">Conclusion</a></li>
</ol>

<a name="desc"></a>
### Description

Analyzing MTA subway line performance, delays, incidents, and on-time performance across NYC from 2020–2025. 
* [Subway Delays](https://data.ny.gov/Transportation/MTA-Subway-Trains-Delayed-Beginning-2020/9zbp-wz3y)  
* [Subway Incidents Causing Delays](https://data.ny.gov/Transportation/MTA-Subway-Delay-Causing-Incidents-Beginning-2020/g937-7k7c)
* [On-Time-Performance](https://data.ny.gov/Transportation/MTA-Subway-Terminal-On-Time-Performance-Beginning-/f6rf-2a3t)

Research questions:

* Which line performs worst by delay rate and on-time performance (OTP), and what factors contribute to this?
* Which year performed best and worst by delay rate, and what factors are associated with this?
* Which months are least reliable on average, and what factors are associated with this?
* Which incident categories occur most frequently, and which cause the greatest delays?

Notes

* Division - The A Division (numbered subway lines and S 42nd) and B Division (lettered subway lines).
* Line - Each subway line (1, 2, 3, 4, 5, 6, 7, A, C, E, B, D, F, M, G, JZ, L, N, Q, R, S 42nd, S Rock, S Fkln)
* Day Type - Represents weekday as 1 and weekend as 2.

* Infrastructure & Equipment – Delays from the physical subway system itself: signal failures, track defects, subway car mechanical problems, and station/structural issues
* Planned ROW (Right-of-Way) Work – Delays caused by scheduled maintenance or capital construction work performed on the tracks
* Police & Medical – Delays from law-enforcement actions or medical emergencies, including unauthorized people on the tracks and incidents like crime or sick passengers that require a police or medical response
* Crew Availability – Delays caused by a shortage of available train operators/conductors (staffing shortfalls, absences)
* Operating Conditions – Delays tied to how the system is being run in real time, most notably overcrowding
* External Factors – Delays from causes outside MTA's direct control, such as inclement weather

<a name="dca"></a>
### Data Cleaning & Analysis

#### Data Cleaning
Data cleaning was completed using Python for all three datasets:
#### Delays 
* 18592 rows
* 6 columns: Month (yyy-mm-dd), Division, Line, Day Type, Reporting Category, Delays
* Split the Month column into name month & full year

#### Incidents
* 24332 rows
* 6 columns: Month (yyy-mm-dd), Division, Line, Day Type, Reporting Category, Incidents
* Split the Month column into name month & full year

#### On Time Performance
* 5092 rows
* 7 columns: Month (yyy-mm-dd), Division, Line, Day Type, number of on time trips, number of scheduled trips, % of on time performance

#### Created a combined Dataframe between all datasets
* Merged all of the dataframes into one
* Removed the smaller, speciality lines from the list
* Formatted data columns to be more readable
___
#### Analysis 

#### Line Analysis
This analysis identifies which lines are least reliable, using both on-time performance (OTP) and delay rate (delays per scheduled trip). Delay rate controls for service volume, allowing comparison independent of how frequently a line runs.

The B, F, C, 2, and N lines rank as the five worst performers. The B line records both the highest delay rate and the lowest OTP, despite having the fewest scheduled trips among the five.

A review of incident categories for the B line shows that the majority of incidents fall under Operating Conditions. This is consistent with interlining: the B shares track infrastructure with the D, F, Q, M, A, and C lines, which can require the B to yield right-of-way and incur additional delay.

The F and C lines, which also share track with the B, show similarly elevated delay rates and depressed OTP, reinforcing the association between shared-track operation and reduced reliability.

The 2 line does not share track with the B, C, or F lines, so interlining with this group does not explain its ranking. Its presence among the bottom five suggests line-specific factors, such as its own interlining partners, express/local conflicts, or corridor-specific infrastructure, that would require separate investigation. The N line's ranking likely reflects a similar set of independent causes.

![Worst Lines by Delay Rate](https://raw.githubusercontent.com/spencerjauslander/mta-transit-performance/main/MTA%20Project%20Images/Worst%20Lines%20by%20Delay%20Rate.png)

#### Year Analysis
This analysis evaluates system-wide reliability across the five-year period.

2020 recorded the strongest performance on both delay rate and OTP. This is consistent with reduced ridership during the COVID-19 pandemic, which lowered congestion and operational strain on trains, stations, and crews. Delay rate is independent of scheduled trip volume, so a reduction in service alone would not account for the improvement; the more plausible explanation is reduced congestion-related pressure (e.g., crowding-related dwell time, medical incidents).

This relationship is corroborated by 2021, where the easing of pandemic restrictions coincides with rising delays and falling OTP as ridership recovered. The trend continues into 2022, the worst year in the dataset, in which delays peak and OTP reaches its lowest point, consistent with ridership and system load returning to or exceeding pre-pandemic levels.

![Delay Rate per Year](https://github.com/spencerjauslander/mta-transit-performance/blob/main/MTA%20Project%20Images/Delay%20Rate%20per%20Year.png)

#### Month Analysis
This analysis evaluates reliability by month to identify seasonal patterns.

Delay rate and OTP remain relatively stable across the calendar year, indicating limited seasonal variation. OTP stays within a narrow range of 79 – 82% across all twelve months. Delay rate ranges from 2.93% in May to 3.36% in February. February and December are the two least reliable months, with delay rates of 3.36% and 3.33% respectively. March and May are the most reliable, at 3.07% and 2.93%.

Because OTP does not vary meaningfully by month, delay rate is the more informative metric for identifying weaker-performing periods. February's elevated delay rate may be associated with winter operating conditions, including cold-weather equipment strain, snow and ice, and reduced maintenance windows. December's elevated rate may be associated with increased holiday-season ridership, as seasonal visitor and commuter volume rises around major attractions such as the Rockefeller Center Christmas Tree and Radio City Music Hall, adding congestion to the system.

![Delay Rate per Month](https://github.com/spencerjauslander/mta-transit-performance/blob/main/MTA%20Project%20Images/Delay%20Rate%20per%20Month.png)

#### Incident Analysis
| Category | Frequency | Delays per Incident | Profile |
|---|---|---|---|
| Police & Medical | 24.7% | 5.01 | High frequency, low delay |
| Operating Conditions | 23.6% | 3.58 | High frequency, low delay |
| Infrastructure & Equipment | 20.4% | 8.39 | High frequency, high delay |
| Planned ROW Work | 15.6% | 7.93 | Low frequency, high delay |
| Crew Availability | 14.2% | 6.24 | Low frequency, low delay |
| External Factors | 1.6% | 9.09 | Low frequency, high delay |

#### Infrastructure & Equipment - High Frequency, High Delay

The only category that is both common and severe. This is partly explained by the age and complexity of the NYC subway system:

- First subway line opened in 1904
- Network has grown to 472 stations, 28 routes, and ~665 miles of track
- Signal equipment in parts of the system can be 50–80 years old
- With multiple lines sharing tracks, a single equipment failure can cascade into delays across the wider system

#### Police & Medical and Operating Conditions - High Frequency, Low Delay

These are the two most common incident categories, but each is resolved relatively quickly:

- **Police & Medical** (#1 by frequency, 24.7%) is more likely a function of ridership volume and density than infrastructure age — with millions of daily riders, medical emergencies, security incidents, and congestion issues are statistically more likely simply due to scale.
- **Operating Conditions** (#2 by frequency, 23.6%) likely reflects routine scheduling/service adjustments that are typically absorbed without major cascading disruption.

#### Planned ROW Work and External Factors - Low Frequency, High Delay

These are the categories to watch from a severity standpoint:

- **External Factors** is the rarest category (1.6%) but causes the highest average delay per incident (9.09) of any category. A disproportionate impact worth investigating further.
- **Planned ROW Work** (15.6%) also produces high delays per incident (7.93), consistent with the scheduled/major nature of this work.

#### Crew Availability - Low Frequency, Low Delay

The least disruptive category overall (14.2% frequency, 6.24 delays per incident).

![Pie chart of subway incidents](https://github.com/spencerjauslander/mta-transit-performance/blob/main/MTA%20Project%20Images/Pie%20chart%20of%20subway%20incidents.png)
![Incident frequency vs. Average Delay per incident](https://github.com/spencerjauslander/mta-transit-performance/blob/main/MTA%20Project%20Images/Incident%20frequency%20vs.%20Average%20Delay%20per%20incident.png)

<a name="DB"></a>
### Power BI Dashboard

This dashboard is a transportation reliability and root-cause monitoring tool, designed to see the historical performance of the MTA.

Assists in answering three questions: 
* "How has the MTA performed over the last five years?"
* "What has historically caused the most problems?"
* "Have specific lines or incident categories improved, or has performance remained consistent"

All from a single interactive view.

![Power BI snapshot](https://github.com/spencerjauslander/mta-transit-performance/blob/main/MTA%20Project%20Images/Power%20BI%20snapshot.png)

<a name="bespoke"></a>
### Interactive Dashboard (Bespoke Web App)

**[View the live dashboard](https://spencerjauslander.github.io/mta-transit-performance/)**

While the Power BI dashboard above was built for depth of analysis, I wanted a second, browser-based version of this project that anyone could open with a single click — no Power BI Desktop, no file download, just a link. I built that version, "On Time, Mostly," with Claude (Anthropic's AI model) as a coding collaborator.

**Purpose**

The goal was to turn the same underlying data — six years of incidents, delays, and on-time performance across all 19 subway lines — into something a recruiter, hiring manager, or curious rider could explore in a browser in under a minute, without needing any transit or data background to get value out of it. It's meant to sit alongside the Power BI file and Jupyter notebook as the most accessible entry point into the project.

**What it does**

* A live "departure board" showing systemwide on-time performance, total incidents, total delays, and the leading cause of delay
* Click any subway line (color-coded to match the actual MTA line colors) to filter every chart and stat on the page to that line
* Year-over-year trend, monthly seasonality, cause-of-delay breakdown, a full 19-line leaderboard, and a line-by-year heatmap colored on a red-to-green signal scale
* Built with plain HTML/CSS/JS and Chart.js — no build step, no server required, so it runs equally well opened locally or hosted on GitHub Pages

**Working with Claude**

This was my first time building a full interactive front end, and I used Claude end-to-end: scoping what the dashboard should include, writing the HTML/CSS/JS, de-duplicating and re-aggregating the messier raw incident data so the interactive filters stayed accurate, and debugging real deployment issues as they came up (a CDN dependency that silently broke the whole page when blocked, and a nested folder structure from uploading through GitHub's web UI that kept the site from finding its own files). Working through those issues was as valuable as the initial build — it meant actually troubleshooting a live GitHub Pages deployment rather than just receiving a finished file, which is closer to how this kind of work goes in practice.

<a name="conclu"></a>
### Conclusion

**Line reliability**<br>
The B, F, C, 2, and N are the least reliable lines, with the B performing worst on both delay rate and OTP despite having the fewest trips among the five. The likely driver is interlining. The B shares track infrastructure with the D, F, Q, M, A, and C lines, and this shared-track congestion shows up in incident data as Operating Conditions issues. The F and C lines, which also share track with the B, show similarly poor performance, reinforcing this pattern. The 2 and N don't share track with the B/C/F group, so their poor performance likely stems from separate, corridor-specific causes that would need further investigation.

**Year-over-year trends**<br>
Reliability tracks ridership and system strain rather than any structural change: 2020 was the best year (COVID-driven low ridership reduced congestion-related pressure), 2021 worsened as restrictions eased and ridership returned, and 2022 was the worst year on record as ridership and system stress met or exceeded pre-pandemic levels. This suggests reliability is largely a function of demand/congestion, not just capacity or fleet size.

**Seasonal patterns**<br>
Reliability is fairly stable year-round. OTP barely moves (79 – 82%) and delay rate stays in a tight band (2.93 – 3.36%). February and December are the weakest months, plausibly due to winter operating conditions (cold, snow, reduced maintenance windows) and holiday-driven ridership surges, respectively. March and May are the strongest months. Because OTP is nearly flat, delay rate is the more diagnostic metric for spotting weaker months.

**Incident categories**<br>
Incidents split into four functional groups:

High frequency, high delay - Infrastructure & Equipment: the most consequential category, tied to the system's age (signal equipment 50–80 years old) and the cascading effect of shared track.
High frequency, low delay - Police & Medical, Operating Conditions: common but resolved quickly; more a function of ridership scale and routine scheduling than infrastructure.
Low frequency, high delay - External Factors, Planned ROW Work: rare but disproportionately damaging per incident; worth deeper investigation, especially External Factors given its outsized impact relative to how rarely it occurs.
Low frequency, low delay - Crew Availability: the least disruptive category overall.

**Overall**<br>
Two structural factors recur throughout this analysis: shared and aging infrastructure (interlining, legacy signal equipment) and ridership-driven congestion (pandemic-era decline and rebound, holiday season, medical and security incident volume). Together, these factors account for most of the observed variation in reliability across lines, years, and months, and point to infrastructure investment and congestion management as the two levers most likely to improve system performance.
