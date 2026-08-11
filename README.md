# mta-transit-performance

<summary>Contents</summary>
    <li><a href="#desc">Description</a></li>
    <li><a href="#dca">Data Cleaning & Analysis</a></li>
    <li><a href="#DB">Interactive Dashboard</a></li>
    <li><a href="#conclu">Conclusion</a></li>

<a name="desc"></a>
## Description

Analyzing MTA subway line performance, delays, incidents, and on-time performance across NYC from 2020–2025. 
* [Subway Delays](https://data.ny.gov/Transportation/MTA-Subway-Trains-Delayed-Beginning-2020/9zbp-wz3y)  
* [Subway Incidents Causing Delays](https://data.ny.gov/Transportation/MTA-Subway-Delay-Causing-Incidents-Beginning-2020/g937-7k7c)
* [On-Time-Performance](https://data.ny.gov/Transportation/MTA-Subway-Terminal-On-Time-Performance-Beginning-/f6rf-2a3t)

Initial questions/insights
* Which line is the worst, based on delay rate and OTP? Why is a particular line the worse? What is the potential correlation between delay rates and OTP?
* Which year was the best/worst, based on delays? Potential reasons why some years are better/worse?
* Which month is, on average, the worst, based on delays? Potential reasons why months are worse?
* Which incidents happen the most and which cause the most delays?

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
## Data Cleaning & Analysis

### Data Cleaning
Data cleaning was completed using Python for all three datasets:
### Delays 
* 18592 rows
* 6 columns: Month (yyy-mm-dd), Division, Line, Day Type, Reporting Category, Delays
* Split the Month column into name month & full year

### Incidents
* 24332 rows
* 6 columns: Month (yyy-mm-dd), Division, Line, Day Type, Reporting Category, Incidents
* Split the Month column into name month & full year

### On Time Performance
* 5092 rows
* 7 columns: Month (yyy-mm-dd), Division, Line, Day Type, number of on time trips, number of scheduled trips, % of on time performance

### Created a combined Dataframe between all datasets
* Merged all of the dataframes into one
* Removed the smaller, speciality lines from the list
* Formatted data columns to be more readable
___
### Analysis 

### Line Analysis
The line analysis takes a closer look at which lines are consistently unreliable. 
In addition to on-time performance (OTP), we examine delay rate—for every scheduled trip, how many experienced a delay? Both metrics help assess reliability without being influenced by the overall volume of activity on each line.

According to the twin bar/line graph, the B, F, C, 2, and N are the five worst-performing lines. Of these, the B is arguably the least reliable overall, with both the highest delay rate and lowest OTP.

Why is the B train so unreliable despite having the fewest trips among the top five?

Looking at the incident category breakdown for the B line, the majority of incidents are attributed to Operating Conditions. One likely factor is interlining, where the B shares tracks with multiple other lines, including the D, F, Q, M, A, and C. When trains from these other lines need to pass through the same track infrastructure, the B may have to wait, creating additional delays.

This pattern becomes even more apparent when looking at the F and C lines, which also share tracks with the B. Both lines have similarly high delay rates and low OTP, suggesting that shared-track operations and interlining may be contributing significantly to their poor reliability.

The 2 train stands out as an exception, running on a different track from the B, C, and F track. Interlining with those specific lines isn't a plausible explanation for its poor performance. Its appearance in the bottom five points towards its own unique problems (its own interlining partners, express/local conflicts, or corridor-specific infrastructure issues). The N sits in a similar position which would require its own investigation.

We will take a closer look at reporting categories later, analyzing the effects in relation to delays.

### Year Analysis
The year analysis looks over the last five years and checks which year performed the best.

One of the more obvious observations, 2020 was the best year in terms of delay rate and OTP.
This is most likely due to COVID: fewer riders meant lower congestion and less strain on trains, stations, and crews. 
It's worth noting that delay rate ignores the volume of scheduled trips, so a drop in the number of trains running wouldn't, by itself, explain the improvement. Rather, the likely cause is the reduction in ridership and congestion easing the operation pressure that typically causes delays (crowding-related dwell time, medical incidents).
This effect becomes clearer when looking at 2021, where an easing of COVID restrictions correlates with rising delays and falling OTP as ridership rebounded. The trend continues into 2022, the worst year in the dataset, where delays peak and OTP hits an all time low, consistent with ridership and system stress returning to (or exceeding) pre-pandemic levels.

### Month Analysis
The month analysis evaluates subway reliability across the year to identify periods when riders are most likely to experience delays.

Overall, delay rates and on-time performance remain relatively stable throughout the year, suggesting that subway reliability does not vary dramatically by season. On-time performance stays within a narrow band of 79–82% across all twelve months, and delay rates similarly cluster tightly, ranging from 2.93% in May to 3.36% in February. Within this stability, February and December stand out as the two least reliable months, with delay rates of 3.36% and 3.33% respectively, while March and May are the most reliable, with rates of 3.07% and 2.93%.

Because on-time performance doesn't swing meaningfully month to month, delay rate is the more useful signal for distinguishing weaker-performing months. February's elevated rate may reflect winter-related operating challenges, such as cold-weather equipment strain, snow and ice conditions, and reduced maintenance windows. December's continued position near the top of the list may still be influenced by increased passenger volumes during the holiday season, as the city sees a substantial influx of visitors and commuters traveling to major seasonal attractions and events, such as the Rockefeller Center Christmas Tree, Radio City Music Hall, and other holiday destinations. The resulting increase in ridership and congestion may place additional pressure on the system, contributing to more frequent delays.

### Incident Analysis
| Category | Frequency | Delays per Incident | Profile |
|---|---|---|---|
| Police & Medical | 24.7% | 5.01 | High frequency, low delay |
| Operating Conditions | 23.6% | 3.58 | High frequency, low delay |
| Infrastructure & Equipment | 20.4% | 8.39 | High frequency, high delay |
| Planned ROW Work | 15.6% | 7.93 | Low frequency, high delay |
| Crew Availability | 14.2% | 6.24 | Low frequency, low delay |
| External Factors | 1.6% | 9.09 | Low frequency, high delay |

### Infrastructure & Equipment — High Frequency, High Delay

The only category that is both common and severe. This is partly explained by the age and complexity of the NYC subway system:

- First subway line opened in 1904
- Network has grown to 472 stations, 28 routes, and ~665 miles of track
- Signal equipment in parts of the system can be 50–80 years old
- With multiple lines sharing tracks, a single equipment failure can cascade into delays across the wider system

### Police & Medical and Operating Conditions — High Frequency, Low Delay

These are the two most common incident categories, but each is resolved relatively quickly:

- **Police & Medical** (#1 by frequency, 24.7%) is more likely a function of ridership volume and density than infrastructure age — with millions of daily riders, medical emergencies, security incidents, and congestion issues are statistically more likely simply due to scale.
- **Operating Conditions** (#2 by frequency, 23.6%) likely reflects routine scheduling/service adjustments that are typically absorbed without major cascading disruption.

### Planned ROW Work and External Factors — Low Frequency, High Delay

These are the categories to watch from a severity standpoint:

- **External Factors** is the rarest category (1.6%) but causes the highest average delay per incident (9.09) of any category. A disproportionate impact worth investigating further.
- **Planned ROW Work** (15.6%) also produces high delays per incident (7.93), consistent with the scheduled/major nature of this work.

### Crew Availability — Low Frequency, Low Delay

The least disruptive category overall (14.2% frequency, 6.24 delays per incident).



<a name="DB"></a>
## Interactive Dashboard

<a name="conclu"></a>
## Conclusion

- Frequency and delay severity don't always move together. Some of the most common incident types (Police & Medical, Operating Conditions) are comparatively quick to resolve, while rarer categories (External Factors, Planned ROW Work) disproportionately drive delay time.
