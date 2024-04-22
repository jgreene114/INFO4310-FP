// gsap.registerPlugin(ScrollTrigger)
//
// const infoSections = d3.selectAll(".info-child")
//
// infoSections.each(function (d, i) {
//     let trigger = {
//         trigger: this,
//         markers: true,
//         // start: "-100% center",
//         // end: "100% center",
//         start: "-100% 80%",
//         end: "100px 80%",
//         scrub: 1,
//         snap: .5,
//     }
//
//     existingUnion = addAndUnionSegment(existingUnion, segments[i], walkthrough.map, sshsScale)
//     let bounds = existingUnion.layer.getBounds()
//
//
//     gsap.timeline({
//         scrollTrigger: trigger,
//         toggleActions: "restart reverse restart reverse",
//     })
//         .fromTo(this,
//             {y: "100vh"},
//             {y: "50vh"},
//         )
//         .to(this, {
//             y: "00vh",
//             // scrollTrigger: trigger,
//         })
// })

// gsap.to(".info-child", {
//     scrollTrigger: {
//         trigger: ".info-child",
//         markers: true,
//         start: "-=300"
//     },
//
//
// })