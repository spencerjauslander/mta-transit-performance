# mta-transit-performance

<summary>Contents</summary>
  <ol>
    <li><a href="#desc">Description</a></li>
    <li><a href="#dca">Data Cleaning & Analysis</a></li>
    <li><a href="#DB">Interactive Dashboard</a></li>
    <li><a href="#conclu">Conclusion</a></li>
  </ol>

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

## 2a Data Cleaning
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

## 2b Analysis 

### Line Analysis - Which lines are the best/worst in terms of delay rate and OTP
The line analysis takes a closer look at which lines are consistently unreliable. 
In addition to on-time performance (OTP), we examine delay rate—for every scheduled trip, how many experienced a delay? Both metrics help assess reliability without being influenced by the overall volume of activity on each line.

According to the twin bar/line graph, the B, F, C, 2, and N are the five worst-performing lines. Of these, the B is arguably the least reliable overall, with both the highest delay rate and lowest OTP.

Why is the B train so unreliable despite having the fewest trips among the top five?

Looking at the incident category breakdown for the B line, the majority of incidents are attributed to Operating Conditions. One likely factor is interlining, where the B shares tracks with multiple other lines, including the D, F, Q, M, A, and C. When trains from these other lines need to pass through the same track infrastructure, the B may have to wait, creating additional delays.

This pattern becomes even more apparent when looking at the F and C lines, which also share tracks with the B. Both lines have similarly high delay rates and low OTP, suggesting that shared-track operations and interlining may be contributing significantly to their poor reliability.

We will take a closer look at reporting categories later, analyzing the effects in relation to delays.

### Year Analysis
The year analysis looks over the last five years and checks which year performed the best.

One of the more obvious observations, 2020 was the best year in terms of delay rate and OTP.
This is most likely due to COVID: less people taking the subways = less stress on the subway system. 
Note that delay rate ignores the volume of schedule trips so COVID having less overall trips is not a factor.
This effect can be observed with 2021, an observable correlation of COVID reduced restrictions leading to more delays and lower OTP. Ultimately, resulting in the worst year of 2022 where delays reaches a peak and OTP reaches an all time low.

### Month Analysis
The month analysis evaluates subway reliability across the year to identify periods when riders are most likely to experience delays.

Overall, delay rates and on time performance remain relatively stable throughout the year, suggesting that subway reliability does not vary dramatically by season. However, December emerges as the least reliable month overall, combining one of the highest delay rates with relatively low on-time performance and the highest total number of delays.

This deterioration may be influenced by increased passenger volumes during the holiday season. December brings a substantial influx of visitors and commuters traveling to major seasonal attractions and events, such as the Rockefeller Center Christmas Tree, Radio City Music Hall, and other holiday destinations. The resulting increase in ridership and congestion may place additional pressure on the system, contributing to more frequent delays and reduced reliability.

### Incident Analysis
The incident analysis evaluates reporting categories based on their frequency and the average delay they cause. The three most frequent categories are Police & Medical (24.7%), Operating Conditions (23.6%), and Infrastructure & Equipment (20.4%).

These high frequencies are partly explained by the age and complexity of New York City’s subway system. The first subway opened in 1904, and the network has since expanded to 472 stations, 28 routes, and about 665 miles of track. Much of the system still relies on aging infrastructure, including signal equipment that can be 50–80 years old.

At the same time, the subway serves millions of passengers each day, putting constant pressure on trains, tracks, stations, and employees. With multiple lines sharing tracks, a single incident can also create delays across the wider system.

All types of people use the subways: people going to work, tourists, homeless people, addicts. Putting everyone into a rush hour scenario creates friction, especially for those who don't care about causing altercations. 

Overall, the data shows a subway system constantly balancing aging infrastructure with the demands of a growing, heavily used city. The MTA must continue repairing and modernizing the system while keeping it running for millions of daily riders.
