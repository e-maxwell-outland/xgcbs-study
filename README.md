# XG-CBS Pilot Study

A within-subjects human-subjects study examining whether algorithmic
segmentation of multi-agent plans improves human comprehension, trust, and
explicability judgments compared to unsegmented or naively segmented
presentations.

**Status:** Pilot (N = 12) · IRB pending

---

## Background

### Multi-Agent Path Finding (MAPF)

Multi-Agent Path Finding is the problem of computing collision-free paths for
a set of agents (robots, drones, autonomous vehicles) navigating a shared
grid-based environment. Solvers must ensure no two agents occupy the same cell
at the same time, while minimizing total path cost.

### XG-CBS — Explainable Conflict-Based Search

XG-CBS (Kottinger, Almagor, & Lahijanian, ICAPS 2022) extends the standard
Conflict-Based Search algorithm to produce plans that are easier for humans to
understand. The key insight: rather than optimizing path cost alone, XG-CBS
also minimizes *segment cost* — the number of distinct "explanation levels"
across all agents' paths.

A segment groups together all moves that happen at the same explanation level.
Fewer segments mean fewer conceptual chunks a human needs to track. XG-CBS
finds the collision-free plan that achieves both low path cost *and* the
fewest necessary segments, making the plan's structure as transparent as
possible without sacrificing efficiency.

The paper is included in this repository: [`paper/ICAPS-2022-Explainable_CBS.pdf`](paper/ICAPS-2022-Explainable_CBS.pdf)

---

## Study Goals

This pilot study asks two questions:

1. **Does segmentation help at all?** Do people understand and trust a
   segmented plan better than a raw, unsegmented path visualization?
2. **Does *optimal* segmentation matter?** Is XG-CBS's explanation-minimizing
   segmentation more effective than a naive fixed-interval baseline that uses
   the same number of segments but places them at arbitrary time boundaries?

---

## Study Design

All three conditions present the same underlying plans; only the presentation
differs.

| Condition | Description |
|---|---|
| A | Full animated paths — no segmentation |
| B | Fixed-interval segmentation (naive baseline) |
| C | XG-CBS optimal segmentation |

**Per trial** (after each plan):
- Personal comprehension (1–7)
- Decision confidence (1–7)
- Explicability — "could you explain this to someone else?" (1–7)

**Per block** (after all trials in a condition):
- Trust in Automation (TiA) — abbreviated 12-item version
- System Causability Scale (SCS) — 10 items

**Pre-study:** demographics, domain expertise, TiA Propensity to Trust subscale

**Post-study:** forced-choice preference, open-text feedback

---

## References

**XG-CBS**
> Kottinger, J., Almagor, S., & Lahijanian, M. (2022). Conflict-Based Search
> for Explainable Multi-Agent Path Finding. *ICAPS 2022*, 32(1), 692–700.
> https://doi.org/10.1609/icaps.v32i1.19859

**Trust in Automation**
> Körber, M. (2019). Theoretical considerations and development of a
> questionnaire to measure trust in automation. *Proceedings of the IEA 2018
> Congress*, pp. 13–30. Springer. https://doi.org/10.1007/978-3-319-96074-6_2

**System Causability Scale**
> Holzinger, A., Carrington, A., & Müller, H. (2020). Measuring the quality
> of explanations: The System Causability Scale. *KI – Künstliche Intelligenz*,
> 34(2), 193–198. https://doi.org/10.1007/s13218-020-00636-z

**Explanation in AI**
> Miller, T. (2019). Explanation in artificial intelligence: Insights from the
> social sciences. *Artificial Intelligence*, 267, 1–38.
> https://doi.org/10.1016/j.artint.2018.07.007

**Trust calibration**
> Lee, J. D., & See, K. A. (2004). Trust in automation: Designing for
> appropriate reliance. *Human Factors*, 46(1), 50–80.
> https://doi.org/10.1518/hfes.46.1.50_30392
