# S-Pi-Web
This is the web front end for S-Store MIMIC ICU Monitoring Demo. It is intended to demonstrate medical data, including live graphs, originating from the S-Store Database. the web interface will also demonstrate response to alert notifications originating from S-Store.

####Overview Page
The overview page presents overview information for four patients, including name, basic clinical data, and a streaming graph displaying heart rate. Each panel links to a patient detail page. Alerts regarding patients, pushed from the back end, will be displayed in a modal, and acknowleged alerts will be stacked in the right panel.

####Patient Detail Pages
The four patient detail pages represent information specific to a particular patient. Each displays a range of streaming graphs, including heart rate and arterial blood pressure, and will display numerical data specific to each of these graphs. The right upper section of the page displays basic patient information, such as name, age, bed and clinical status. The lower right panel displays links to clinical data, lab data, medications and notes, the specifics of which are displayed in their respective modals.

####Integration with back end server
All of the data displayed on S-Pi-Web is obtained from our vertex back end application, which in turn communicates with the S-Store client. For details of the web API and sockets please see the back end documentation at: https://github.com/Team-B-Capstone/S-Pi-Backend/blob/develop/README.md
