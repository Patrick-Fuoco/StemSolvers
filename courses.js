import wixData from "wix-data";
import wixLocationFrontend from "wix-location-frontend";
import { local } from "wix-storage";
// ...

$w.onReady(() => {
  let userName = local.getItem("userName");
  let userEmail = local.getItem("userEmail");

  if (userName) {
    $w("#fullname").value = userName; // replace #nameInput with your actual input field's ID
  }

  if (userEmail) {
    $w("#email").value = userEmail; // replace #emailInput with your actual input field's ID
  }

  let query = wixLocationFrontend.query;

  // Check if 'subject' parameter exists in the URL
  if (query.subject) {
    $w("#dropdown2").value = query.subject.toUpperCase(); // Set the dropdown value
    filterCoursesSubject(query.subject.toUpperCase()); // Call a function to filter the dataset based on subject
  }

  function filterCoursesSubject(subject) {
    if (subject === "All") {
      // Clear the filter to show all courses
      $w("#coursesDB")
        .setFilter(wixData.filter())
        .then(() => {
          console.log("Showing all courses");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      $w("#coursesDB")
        .setFilter(wixData.filter().eq("subject", subject))
        .then(() => {
          console.log("Courses filtered by subject:", subject);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  if (query.school) {
    $w("#dropdown1").value = query.school.toUpperCase(); // Set the dropdown value
    filterCoursesSchool(query.school.toUpperCase()); // Call a function to filter the dataset based on subject
  }

  // Filter the dataset by the school
  function filterCoursesSchool(school) {
    if (school === "All") {
      // Clear the filter to show all courses
      $w("#coursesDB")
        .setFilter(wixData.filter())
        .then(() => {
          console.log("Showing all courses");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      $w("#coursesDB")
        .setFilter(wixData.filter().eq("school", school))
        .then(() => {
          console.log("Courses filtered by subject:", school);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  $w.onReady(() => {
    // Event listener for the subject dropdown
    $w("#dropdown2").onChange((event) => {
      const selectedSubject = event.target.value; // Get the selected subject
      const selectedSchool = $w("#dropdown1").value; // Get the current school value
      filterCourses(selectedSubject, selectedSchool); // Filter based on both dropdowns
    });

    // Event listener for the school dropdown
    $w("#dropdown1").onChange((event) => {
      const selectedSchool = event.target.value; // Get the selected school
      const selectedSubject = $w("#dropdown2").value; // Get the current subject value
      filterCourses(selectedSubject, selectedSchool); // Filter based on both dropdowns
    });

    function filterCourses(subject, school) {
      console.log(subject);
      let filter = wixData.filter(); // Initialize an empty filter

      // If "All" is selected for subject, ignore the subject filter
      if (subject && subject !== "RESET_ALL") {
        filter = filter.eq("subject", subject); // Apply subject filter
      }

      // If "All" is selected for school, ignore the school filter
      if (school && school !== "RESET_ALL") {
        filter = filter.eq("school", school); // Apply school filter
      }

      // Apply the combined filter
      $w("#coursesDB")
        .setFilter(filter)
        .then(() => {
          console.log(
            "Courses filtered by subject and school:",
            subject,
            school
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });

  let cc;
  let online;
  let inperson;
  let method;
  let type;
  let duration;

  $w("#button4").onClick(() => {
    // Hide box11 when button4 is clicked
    $w("#box11").hide();
  });

  $w("#button5").onClick(() => {
    $w("#box6").hide();
  });

  // Step 1: Handle the button click to show the course information
  $w("#repeater1").onItemReady(($item, itemData, index) => {
    console.log("itemData", itemData);

    $item("#button1").onClick(() => {
      console.log("whoah", itemData);
      $w("#box6").show("fade");
      cc = String(itemData.course_code); // Store the course code
      $w("#text3").text = itemData.course_code;
      $w("#text13").text = itemData.subject;
      $w("#text12").text = itemData.title;
      $w("#text11").text = itemData.description;
      let plainText = itemData.bullet_points.replace(/<\/?[^>]+(>|$)/g, "");
      $item("#text10").text = plainText;
    });
  });

  $w("#button2").onClick(() => {
    $w("#box6").hide();
    $w("#box11").show("fade");
  });

  // Step 2: Handle form submission and logic based on the form's method, type, and duration
  $w("#button3").onClick(() => {
    let name = $w("#fullname").value; // replace #nameInput with your actual input field's ID
    let email = $w("#email").value; // replace #emailInput with your actual input field's ID

    // Store the name and email in local storage using Wix's local API
    local.setItem("userName", name);
    local.setItem("userEmail", email);
    // Submit the dataset (this will save all connected field values)
    $w("#formDB")
      .save()
      .then(() => {
        $w("#html1").show();
        console.log("Form submitted and data saved to the dataset!");
        console.log(cc);
        // Step 3: Query the coursesDB to find the matching course_code and extract tutors
        wixData
          .query("Coursed_cleaned")

          .eq("course_code", cc) // Look for the matching course_code
          .find()
          .then((results) => {
            if (results.items.length > 0) {
              let matchedRow = results.items[0]; // Get the first matching result
              console.log(matchedRow);
              // Extract the tutor names from the 8th and 9th columns
              online = matchedRow.onlineTutor;
              inperson = matchedRow.inPersonTutor;

              // Log the tutor names for verification
              console.log("Tutor 1 (Online):", online);
              console.log("Tutor 2 (In-Person):", inperson);

              // Step 4: Query the FormDB to get the most recent method, type, and duration
              wixData
                .query("Tutor_retrieval")
                .limit(1)
                .find()
                .then((results) => {
                  if (results.items.length > 0) {
                    let mostRecentRow = results.items[0]; // Get the most recent entry

                    method = mostRecentRow["method"];
                    type = mostRecentRow["type"];
                    duration = mostRecentRow["duration"];

                    // Step 5: Conditional logic based on method, type, and duration
                    if (method === "Online") {
                      if (online === "N/A") {
                        // No online tutor available
                        $w("#html1").hide();
                        console.log("No online tutor available.");
                        $w("#text15").show();
                        $w("#text16").show();
                        setTimeout(() => {
                          $w("#text15").hide();
                          $w("#text16").hide();
                        }, 4000);
                      } else {
                        // Online tutor available, redirect based on type and duration
                        redirectToTutorLink(online, type, duration);
                      }
                    } else if (method === "In-person") {
                      if (inperson === "N/A") {
                        // No in-person tutor available
                        $w("#html1").hide();
                        console.log("No in-person tutor available.");
                        $w("#text14").show();
                        setTimeout(() => {
                          $w("#text14").hide();
                        }, 4000);
                      } else {
                        // In-person tutor available, redirect based on type and duration
                        redirectToTutorLink(inperson, type, duration);
                      }
                    }
                  } else {
                    console.log("No recent form data found in FormDB.");
                  }
                })
                .catch((err) => {
                  console.error("Error querying FormDB dataset:", err);
                });
            } else {
              console.log("No matching course found for course_code:", cc);
            }
          })
          .catch((err) => {
            console.error("Error querying coursesDB:", err);
          });
      })
      .catch((err) => {
        console.error("Error saving form data:", err);
      });
  });

  // Step 6: Function to redirect based on type and duration
  function redirectToTutorLink(tutorName, type, duration) {
    // Query the Tutor_retrieval dataset to find the appropriate tutor
    wixData
      .query("Tutors")
      .eq("title", tutorName)
      .find()
      .then((results) => {
        if (results.items.length > 0) {
          let tutorRow = results.items[0]; // Get the tutor's row

          // Determine the link based on the type and duration
          let link = "";
          if (type === "Solo" && duration === "1 hour") {
            link = String(tutorRow["601"]);
          } else if (type === "Solo" && duration === "2 hours") {
            link = tutorRow["1201"];
          } else if (type === "Bringing a friend" && duration === "1 hour") {
            link = String(tutorRow["602"]);
          } else if (type === "Bringing a friend" && duration === "2 hours") {
            link = String(tutorRow["1202"]);
          }
          console.log(link);
          // Redirect to the tutor's link

          console.log("Redirecting to:", link);

          if (link) {
            setTimeout(() => {
              $w("#html1").hide();
              wixLocationFrontend.to(link); // Redirect after 2 seconds
            }, 1000);
          } else {
            console.log(
              "No matching link found for the selected type and duration."
            );
          }
        } else {
          console.log("Tutor not found in Tutor_retrieval dataset.");
        }
      })
      .catch((err) => {
        console.error("Error querying Tutor_retrieval dataset:", err);
      });
  }
});
