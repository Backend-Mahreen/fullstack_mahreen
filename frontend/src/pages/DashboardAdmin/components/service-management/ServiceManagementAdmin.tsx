import { Plus, UserRoundPlus } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  serviceManagementRepository,
  type BulkAssignmentInput,
  type ConsultationStatus,
  type NewServiceInput,
  type ServiceManagementSnapshot,
  type ServiceOperation,
  type ServiceRequest,
} from "../../../../services/serviceManagement/serviceManagementRepository";
import ServiceManagementMetrics from "./ServiceManagementMetrics";
import ServiceOperationalOverview from "./ServiceOperationalOverview";
import ServiceRequestsTable from "./ServiceRequestsTable";
import ServiceOperationsTable from "./ServiceOperationsTable";
import {
  AssignPmDialog,
  OperationEditDialog,
} from "./ServiceManagementDialogs";

const BulkAssignmentWorkspace = lazy(
  () => import("./BulkAssignmentWorkspace"),
);
const AddServiceWorkspace = lazy(
  () => import("./AddServiceWorkspace"),
);

type ServiceManagementAdminProps = {
  query: string;
  onLocalAction: (message: string) => void;
};

const SERVICE_MANAGEMENT_STYLES = `
  .sm-admin {
    --sm-gold: #edc64f;
    --sm-gold-soft: #d6b56b;
    --sm-panel: #151514;
    --sm-panel-raised: #191918;
    --sm-border: rgba(231, 197, 103, .17);
    --sm-border-strong: rgba(237, 198, 79, .39);
    position: relative;
    width: 100%;
    padding-bottom: 32px;
    color: #efede8;
  }

  .sm-admin__reveal {
    opacity: 0;
    transform: translate3d(0, 18px, 0) scale(.992);
    animation: sm-admin-reveal 680ms var(--sm-delay, 0ms) cubic-bezier(.22,1,.36,1) both;
  }

  .sm-admin__heading {
    display: flex;
    min-height: 112px;
    margin-bottom: 28px;
    align-items: center;
    justify-content: space-between;
    gap: 34px;
  }

  .sm-admin__heading h1 {
    margin: 0;
    color: #f3f1ec;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: clamp(34px, 3.4vw, 48px);
    font-weight: 610;
    line-height: 1.05;
    letter-spacing: -.045em;
  }

  .sm-admin__heading p {
    max-width: 690px;
    margin: 10px 0 0;
    color: #a39e94;
    font-size: 14px;
    line-height: 1.55;
  }

  .sm-admin__heading-actions {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 34px;
  }

  .sm-admin__heading-actions button {
    display: inline-flex;
    min-width: 190px;
    min-height: 62px;
    padding: 14px 26px;
    align-items: center;
    justify-content: center;
    gap: 12px;
    border: 1px solid #f2c941;
    border-radius: 999px;
    color: #161207;
    background: linear-gradient(135deg, #ffdb5e, #ecc03c);
    box-shadow: 0 13px 30px rgba(232, 186, 45, .18), 0 0 0 1px rgba(255, 224, 107, .08);
    cursor: pointer;
    font: 700 14px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .055em;
    transition: transform 240ms cubic-bezier(.22,1,.36,1), box-shadow 240ms ease, filter 240ms ease;
  }

  .sm-admin__heading-actions button:last-child {
    min-width: 182px;
    color: #211808;
    border-color: #e4bd67;
    background: linear-gradient(135deg, #f0d38d, #dcb564);
  }

  .sm-admin__heading-actions button:hover {
    filter: brightness(1.07);
    box-shadow: 0 17px 38px rgba(232, 186, 45, .28), 0 0 28px rgba(237, 198, 79, .12);
    transform: translateY(-4px) scale(1.015);
  }

  .sm-admin__heading-actions svg {
    width: 18px;
    height: 18px;
  }

  .sm-admin__metrics {
    display: grid;
    margin-bottom: 50px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 22px;
  }

  .sm-admin__metric {
    position: relative;
    isolation: isolate;
    min-height: 178px;
    padding: 26px 25px 23px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,.085);
    border-radius: 7px;
    background: radial-gradient(circle at 95% 5%, rgba(237,198,79,.075), transparent 39%), linear-gradient(145deg, rgba(255,255,255,.018), transparent 62%), var(--sm-panel);
    box-shadow: 0 20px 50px rgba(0,0,0,.17);
    transition: transform 260ms cubic-bezier(.22,1,.36,1), border-color 260ms ease, box-shadow 260ms ease;
  }

  .sm-admin__metric::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 3px;
    content: "";
    background: linear-gradient(90deg, #e6bc3e 0 70%, transparent 70%);
    opacity: 0;
    transform: scaleX(.3);
    transform-origin: left;
    transition: opacity 260ms ease, transform 440ms cubic-bezier(.22,1,.36,1);
  }

  .sm-admin__metric:first-child {
    border-color: rgba(237,198,79,.18);
  }

  .sm-admin__metric:first-child::after,
  .sm-admin__metric:hover::after {
    opacity: .9;
    transform: scaleX(1);
  }

  .sm-admin__metric:hover {
    border-color: var(--sm-border-strong);
    box-shadow: 0 22px 56px rgba(0,0,0,.27), 0 0 28px rgba(237,198,79,.07);
    transform: translateY(-5px);
  }

  .sm-admin__metric-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    color: #aaa59b;
    font: 700 14px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .16em;
    text-transform: uppercase;
  }

  .sm-admin__metric-topline svg {
    width: 21px;
    height: 21px;
    color: var(--sm-gold);
    filter: drop-shadow(0 0 8px rgba(237,198,79,.16));
  }

  .sm-admin__metric-value {
    display: flex;
    min-height: 57px;
    margin-top: 18px;
    align-items: end;
    gap: 10px;
  }

  .sm-admin__metric-value strong {
    overflow-wrap: anywhere;
    color: #f1efea;
    font-size: clamp(26px, 2.8vw, 42px);
    font-weight: 650;
    line-height: 1;
    letter-spacing: -.045em;
  }

  .sm-admin__metric-value b {
    max-width: 88px;
    padding-bottom: 5px;
    color: var(--sm-gold);
    font: 700 14px/1.25 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .04em;
    text-transform: uppercase;
  }

  .sm-admin__metric > small {
    display: block;
    max-width: 180px;
    margin-top: 13px;
    color: #8b867d;
    font: 500 14px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__overview-grid {
    display: grid;
    margin-bottom: 46px;
    grid-template-columns: minmax(0, 1fr) minmax(280px, 330px);
    gap: 54px;
    align-items: stretch;
  }

  .sm-admin__panel,
  .sm-admin__table-panel {
    border: 1px solid rgba(255,255,255,.085);
    border-radius: 8px;
    background: linear-gradient(145deg, rgba(255,255,255,.012), transparent 55%), var(--sm-panel);
    box-shadow: 0 22px 58px rgba(0,0,0,.17);
    transition: border-color 260ms ease, box-shadow 260ms ease, transform 260ms cubic-bezier(.22,1,.36,1);
  }

  .sm-admin__panel:hover,
  .sm-admin__table-panel:hover {
    border-color: rgba(237,198,79,.24);
    box-shadow: 0 26px 64px rgba(0,0,0,.25), 0 0 30px rgba(237,198,79,.045);
  }

  .sm-admin__funnel {
    min-height: 470px;
    padding: 28px 31px 30px;
  }

  .sm-admin__panel-heading,
  .sm-admin__meetings-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
  }

  .sm-admin__panel-heading h2,
  .sm-admin__meetings-heading h2 {
    margin: 0;
    color: #efede8;
    font-size: 20px;
    font-weight: 620;
    line-height: 1.28;
    letter-spacing: -.025em;
  }

  .sm-admin__panel-heading button {
    display: grid;
    width: 36px;
    height: 32px;
    place-items: center;
    border: 0;
    color: #b0aa9f;
    background: transparent;
    cursor: pointer;
  }

  .sm-admin__panel-heading svg {
    width: 20px;
  }

  .sm-admin__funnel-stages {
    display: grid;
    margin-top: 37px;
    grid-template-columns: 1.18fr 1fr .85fr .55fr;
    gap: 30px;
  }

  .sm-admin__funnel-stage {
    position: relative;
    display: flex;
    min-width: 0;
    min-height: 74px;
    padding: 15px 20px 15px 28px;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    background: rgba(111,91,40,.74);
    clip-path: polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%, 10% 50%);
    animation: sm-funnel-enter 680ms calc(390ms + var(--sm-stage, 0) * 90ms) cubic-bezier(.22,1,.36,1) both;
  }

  .sm-admin__funnel-stage:first-child {
    padding-left: 18px;
    clip-path: polygon(0 0, 88% 0, 100% 50%, 88% 100%, 0 100%);
  }

  .sm-admin__funnel-stage.is-stage-1 { --sm-stage: 1; background: rgba(87,73,38,.75); }
  .sm-admin__funnel-stage.is-stage-2 { --sm-stage: 2; background: rgba(128,105,45,.86); }
  .sm-admin__funnel-stage.is-stage-3 { --sm-stage: 3; background: rgba(177,142,48,.92); }
  .sm-admin__funnel-stage.is-stage-4 { --sm-stage: 4; color: #211706; background: #f3c94b; box-shadow: 0 0 25px rgba(243,201,75,.14); }

  .sm-admin__funnel-stage span {
    overflow: hidden;
    color: #c9b982;
    font: 600 14px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .sm-admin__funnel-stage.is-stage-4 span,
  .sm-admin__funnel-stage.is-stage-4 strong {
    color: #211706;
  }

  .sm-admin__funnel-stage strong {
    margin-top: 4px;
    color: #f0e6bd;
    font: 700 14px/1.1 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__funnel-stats {
    display: grid;
    margin-top: 42px;
    padding-top: 29px;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    border-top: 1px solid var(--sm-border);
  }

  .sm-admin__funnel-stats div {
    display: grid;
    justify-items: center;
    text-align: center;
  }

  .sm-admin__funnel-stats span {
    color: #8f897f;
    font: 600 14px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .sm-admin__funnel-stats strong {
    margin-top: 9px;
    color: #f0ede7;
    font: 700 22px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__funnel-stats small {
    margin-top: 7px;
    color: #9d8d59;
    font: 500 14px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__meetings {
    display: flex;
    min-height: 470px;
    padding: 28px 25px 24px;
    flex-direction: column;
  }

  .sm-admin__meetings-heading > span {
    display: grid;
    min-width: 70px;
    min-height: 42px;
    padding: 6px 8px;
    place-items: center;
    border-radius: 8px;
    color: var(--sm-gold);
    background: rgba(237,198,79,.1);
    font: 700 14px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__meetings-heading > span small {
    font-size: 14px;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .sm-admin__meeting-list {
    display: grid;
    margin-top: 22px;
    gap: 5px;
  }

  .sm-admin__meeting {
    display: grid;
    min-height: 74px;
    padding: 9px 0;
    grid-template-columns: 64px 1px minmax(0,1fr);
    align-items: center;
    gap: 13px;
    color: inherit;
    text-decoration: none;
    transition: transform 190ms ease, color 190ms ease;
  }

  .sm-admin__meeting:hover {
    color: var(--sm-gold);
    transform: translateX(3px);
  }

  .sm-admin__meeting time {
    display: grid;
    justify-items: end;
  }

  .sm-admin__meeting time strong {
    color: #efece5;
    font: 700 14px ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__meeting time small {
    color: #8c867c;
    font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    text-transform: uppercase;
  }

  .sm-admin__meeting > span {
    width: 1px;
    height: 48px;
    background: var(--sm-border);
  }

  .sm-admin__meeting > div {
    display: grid;
    min-width: 0;
  }

  .sm-admin__meeting > div strong {
    overflow: hidden;
    color: #dedad3;
    font: 600 14px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace;
    text-overflow: ellipsis;
  }

  .sm-admin__meeting > div small {
    margin-top: 3px;
    overflow: hidden;
    color: #8d877d;
    font: 500 14px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
    text-overflow: ellipsis;
  }

  .sm-admin__meeting-empty {
    display: grid;
    min-height: 270px;
    place-items: center;
    align-content: center;
    color: #888278;
    text-align: center;
  }

  .sm-admin__meeting-empty svg {
    width: 28px;
    height: 28px;
    color: var(--sm-gold-soft);
  }

  .sm-admin__meeting-empty strong {
    margin-top: 12px;
    color: #d9d4cb;
    font-size: 14px;
  }

  .sm-admin__meeting-empty span {
    max-width: 210px;
    margin-top: 6px;
    font-size: 14px;
  }

  .sm-admin__calendar-button {
    width: 100%;
    min-height: 35px;
    margin-top: auto;
    border: 1px solid rgba(237,198,79,.25);
    color: #c9c0a5 !important;
    background: transparent;
    cursor: pointer;
    font: 700 14px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .17em;
    text-transform: uppercase;
    transition: color 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
  }

  .sm-admin__calendar-button:hover {
    border-color: var(--sm-gold);
    color: var(--sm-gold) !important;
    box-shadow: 0 0 18px rgba(237,198,79,.08);
  }

  .sm-admin__table-panel {
    position: relative;
    margin-bottom: 46px;
    overflow: visible;
  }

  .sm-admin__table-toolbar {
    display: flex;
    min-height: 68px;
    padding: 0 18px;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    border-bottom: 1px solid var(--sm-border);
  }

  .sm-admin__tabs {
    display: flex;
    min-width: 0;
    align-self: stretch;
    align-items: center;
    gap: 28px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .sm-admin__tabs button {
    position: relative;
    min-height: 100%;
    padding: 0 5px;
    border: 0;
    color: #aaa398;
    background: transparent;
    cursor: pointer;
    font: 600 14px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .09em;
    white-space: nowrap;
    transition: color 180ms ease;
  }

  .sm-admin__tabs button::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    content: "";
    background: var(--sm-gold);
    box-shadow: 0 0 10px rgba(237,198,79,.28);
    opacity: 0;
    transform: scaleX(.35);
    transition: opacity 180ms ease, transform 240ms ease;
  }

  .sm-admin__tabs button:hover,
  .sm-admin__tabs button.is-active {
    color: var(--sm-gold);
  }

  .sm-admin__tabs button.is-active::after {
    opacity: 1;
    transform: scaleX(1);
  }

  .sm-admin__category-filter {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 10px;
    color: #9a9489;
    font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__category-filter select {
    min-width: 160px;
    min-height: 32px;
    padding: 6px 28px 6px 10px;
    border: 1px solid rgba(255,255,255,.1);
    color: #c8c2b8;
    background: #242423;
    font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__category-filter svg,
  .sm-admin__table-tools svg {
    width: 16px;
    height: 16px;
  }

  .sm-admin__table-scroll {
    width: 100%;
    overflow-x: auto;
  }

  .sm-admin__table {
    width: 100%;
    min-width: 1040px;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .sm-admin__table th,
  .sm-admin__table td {
    padding: 16px 18px;
    border-bottom: 1px solid rgba(231,197,103,.11);
    text-align: left;
    vertical-align: middle;
  }

  .sm-admin__table th {
    height: 60px;
    color: #aaa49a;
    background: rgba(255,255,255,.045);
    font: 700 14px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .095em;
    text-transform: uppercase;
  }

  .sm-admin__table td {
    height: 76px;
    color: #bbb5ac;
    font: 500 14px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace;
    transition: color 180ms ease, background 180ms ease;
  }

  .sm-admin__table tbody tr:hover td {
    color: #e2ddd4;
    background: rgba(237,198,79,.026);
  }

  .sm-admin__requests-table th:nth-child(1) { width: 20%; }
  .sm-admin__requests-table th:nth-child(2) { width: 13%; }
  .sm-admin__requests-table th:nth-child(3) { width: 15%; }
  .sm-admin__requests-table th:nth-child(4) { width: 11%; }
  .sm-admin__requests-table th:nth-child(5) { width: 12%; }
  .sm-admin__requests-table th:nth-child(6) { width: 15%; }
  .sm-admin__requests-table th:nth-child(7) { width: 14%; }

  .sm-admin__client-cell,
  .sm-admin__operation-identity {
    display: flex;
    min-width: 0;
    align-items: center;
    gap: 13px;
  }

  .sm-admin__client-cell > span,
  .sm-admin__operation-identity > span {
    display: grid;
    width: 34px;
    height: 34px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid rgba(237,198,79,.11);
    border-radius: 50%;
    color: var(--sm-gold);
    background: rgba(237,198,79,.1);
    font: 700 14px ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__client-cell div,
  .sm-admin__operation-identity div {
    display: grid;
    min-width: 0;
  }

  .sm-admin__client-cell strong,
  .sm-admin__operation-identity strong {
    overflow: hidden;
    color: #ece9e3;
    font: 600 14px/1.3 Inter, ui-sans-serif, system-ui, sans-serif;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sm-admin__client-cell small,
  .sm-admin__operation-identity small,
  .sm-admin__budget-copy,
  .sm-admin__stakeholder-name,
  .sm-admin__progress-copy {
    display: block;
    margin-top: 3px;
    overflow: hidden;
    color: #837d74;
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sm-admin__service-chip,
  .sm-admin__stakeholder-chip {
    display: inline-flex;
    max-width: 100%;
    padding: 6px 8px;
    overflow: hidden;
    border-radius: 8px;
    color: #d3cdc3;
    background: rgba(255,255,255,.055);
    font-size: 14px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sm-admin__request-status,
  .sm-admin__lifecycle {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #e9c74f;
    font: 700 14px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .1em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .sm-admin__request-status i,
  .sm-admin__lifecycle i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 8px currentColor;
  }

  .sm-admin__request-status.is-reviewed,
  .sm-admin__request-status.is-converted,
  .sm-admin__lifecycle { color: #4bd889; }
  .sm-admin__request-status.is-scheduled { color: #62aefa; }
  .sm-admin__request-status.is-cancelled { color: #f3aaa9; }
  .sm-admin__request-status.is-archived,
  .sm-admin__lifecycle.is-muted { color: #8e887e; }

  .sm-admin__pm-name {
    color: #ddd7ce;
    font-size: 14px;
    font-weight: 600;
  }

  .sm-admin__unassigned {
    color: #8a847a;
    font-size: 14px;
  }

  .sm-admin__action-cell {
    position: relative;
  }

  .sm-admin__assign-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    color: var(--sm-gold) !important;
    background: transparent;
    cursor: pointer;
    font: 700 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .sm-admin__assign-link svg {
    width: 13px;
    height: 13px;
  }

  .sm-admin__row-menu-button {
    display: grid;
    width: 32px;
    height: 34px;
    place-items: center;
    border: 0;
    color: #b9b1a6;
    background: transparent;
    cursor: pointer;
  }

  .sm-admin__row-menu-button svg {
    width: 17px;
    height: 17px;
  }

  .sm-admin__row-menu {
    position: absolute;
    z-index: 30;
    top: 55px;
    right: 14px;
    display: grid;
    min-width: 145px;
    padding: 6px;
    border: 1px solid var(--sm-border-strong);
    border-radius: 5px;
    background: #20201e;
    box-shadow: 0 18px 45px rgba(0,0,0,.6), 0 0 18px rgba(237,198,79,.05);
  }

  .sm-admin__row-menu button {
    min-height: 31px;
    padding: 7px 9px;
    border: 0;
    color: #c3bdb3;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    text-align: left;
  }

  .sm-admin__row-menu button:hover {
    color: var(--sm-gold);
    background: rgba(237,198,79,.07);
  }

  .sm-admin__pagination-footer {
    display: flex;
    min-height: 56px;
    padding: 10px 18px;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
  }

  .sm-admin__pagination-footer > span {
    color: #a09a90;
    font: 600 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .07em;
  }

  .sm-admin__pagination-footer > div {
    display: flex;
    gap: 7px;
  }

  .sm-admin__pagination-footer button {
    display: grid;
    width: 32px;
    height: 32px;
    place-items: center;
    border: 1px solid rgba(237,198,79,.22);
    color: #aaa398;
    background: transparent;
    cursor: pointer;
    font: 700 14px ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .sm-admin__pagination-footer button.is-active {
    color: #181205;
    background: #f0c846;
    box-shadow: 0 0 14px rgba(240,200,70,.12);
  }

  .sm-admin__pagination-footer button:disabled {
    opacity: .35;
    cursor: not-allowed;
  }

  .sm-admin__empty {
    display: grid;
    min-height: 132px;
    padding: 28px;
    place-items: center;
    border-bottom: 1px solid var(--sm-border);
    color: #8e887e;
    font: 500 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    text-align: center;
  }

  .sm-admin__operations-panel {
    margin-bottom: 0;
  }

  .sm-admin__table-tools {
    display: flex;
    gap: 8px;
  }

  .sm-admin__table-tools button,
  .sm-admin__operation-actions a,
  .sm-admin__operation-actions button {
    display: grid;
    width: 34px;
    height: 34px;
    place-items: center;
    border: 0;
    color: #b9b2a7;
    background: transparent;
    cursor: pointer;
    transition: color 180ms ease, background 180ms ease, filter 180ms ease;
  }

  .sm-admin__table-tools button:hover,
  .sm-admin__operation-actions a:hover,
  .sm-admin__operation-actions button:hover {
    color: var(--sm-gold);
    background: rgba(237,198,79,.06);
    filter: drop-shadow(0 0 7px rgba(237,198,79,.16));
  }

  .sm-admin__operation-identity > span {
    border-radius: 3px;
  }

  .sm-admin__operation-identity svg {
    width: 17px;
    height: 17px;
  }

  .sm-admin__operation-actions {
    display: flex;
    gap: 4px;
  }

  .sm-admin__operation-actions svg {
    width: 16px;
    height: 16px;
  }

  .sm-admin__dialog-backdrop {
    position: fixed;
    z-index: 250;
    inset: 0;
    display: grid;
    padding: 24px;
    place-items: center;
    background: rgba(0,0,0,.78);
    backdrop-filter: blur(9px);
    animation: sm-dialog-backdrop 220ms ease both;
  }

  .sm-admin__dialog {
    position: relative;
    width: min(620px, 100%);
    padding: 30px;
    border: 1px solid var(--sm-border-strong);
    border-radius: 10px;
    background: radial-gradient(circle at 100% 0, rgba(237,198,79,.08), transparent 40%), #161615;
    box-shadow: 0 30px 90px rgba(0,0,0,.72), 0 0 38px rgba(237,198,79,.07);
    animation: sm-dialog-enter 380ms cubic-bezier(.22,1,.36,1) both;
  }

  .sm-admin__dialog-close {
    position: absolute;
    top: 16px;
    right: 16px;
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 50%;
    color: #aaa49a;
    background: transparent;
    cursor: pointer;
  }

  .sm-admin__dialog-close svg {
    width: 17px;
  }

  .sm-admin__dialog-heading {
    display: flex;
    padding-right: 38px;
    align-items: flex-start;
    gap: 16px;
  }

  .sm-admin__dialog-heading > span {
    display: grid;
    width: 48px;
    height: 48px;
    flex: 0 0 auto;
    place-items: center;
    border: 1px solid var(--sm-border);
    border-radius: 7px;
    color: var(--sm-gold);
    background: rgba(237,198,79,.08);
  }

  .sm-admin__dialog-heading svg {
    width: 21px;
  }

  .sm-admin__dialog-heading small {
    color: var(--sm-gold);
    font: 700 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .sm-admin__dialog-heading h2 {
    margin: 4px 0 0;
    color: #f0ede7;
    font-size: 22px;
  }

  .sm-admin__dialog-heading p {
    margin: 5px 0 0;
    color: #918b81;
    font-size: 14px;
  }

  .sm-admin__dialog-form {
    display: grid;
    margin-top: 28px;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }

  .sm-admin__dialog-form label {
    display: grid;
    gap: 8px;
  }

  .sm-admin__dialog-form label.is-wide {
    grid-column: 1 / -1;
  }

  .sm-admin__dialog-form label > span {
    color: #aaa399;
    font: 700 14px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  .sm-admin__dialog-form input,
  .sm-admin__dialog-form select {
    width: 100%;
    min-height: 46px;
    padding: 10px 12px;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 5px;
    outline: 0;
    color: #e8e4dc;
    background: #0f0f0e;
    font-size: 14px;
    transition: border-color 180ms ease, box-shadow 180ms ease;
  }

  .sm-admin__dialog-form input:focus,
  .sm-admin__dialog-form select:focus {
    border-color: var(--sm-border-strong);
    box-shadow: 0 0 0 3px rgba(237,198,79,.05), 0 0 18px rgba(237,198,79,.04);
  }

  .sm-admin__dialog-actions {
    display: flex;
    margin-top: 8px;
    grid-column: 1 / -1;
    justify-content: flex-end;
    gap: 11px;
  }

  .sm-admin__dialog-actions button {
    min-height: 42px;
    padding: 10px 18px;
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 5px;
    color: #aaa49a;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    font-weight: 700;
  }

  .sm-admin__dialog-actions button:last-child {
    border-color: var(--sm-gold);
    color: #171205;
    background: #f0c846;
    box-shadow: 0 9px 24px rgba(237,198,79,.12);
  }

  @keyframes sm-admin-reveal {
    from { opacity: 0; transform: translate3d(0,18px,0) scale(.992); }
    to { opacity: 1; transform: none; }
  }

  @keyframes sm-funnel-enter {
    from { opacity: 0; transform: translateX(-18px) scaleX(.84); }
    to { opacity: 1; transform: none; }
  }

  @keyframes sm-dialog-backdrop {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes sm-dialog-enter {
    from { opacity: 0; transform: translateY(18px) scale(.97); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 1280px) {
    .sm-admin__heading-actions { gap: 14px; }
    .sm-admin__heading-actions button { min-width: 160px; }
    .sm-admin__overview-grid { gap: 24px; }
    .sm-admin__funnel-stages { gap: 14px; }
  }

  @media (max-width: 1080px) {
    .sm-admin__heading { align-items: flex-start; flex-direction: column; }
    .sm-admin__heading-actions { width: 100%; }
    .sm-admin__heading-actions button { flex: 1; }
    .sm-admin__metrics { grid-template-columns: repeat(2, minmax(0,1fr)); }
    .sm-admin__overview-grid { grid-template-columns: 1fr; }
    .sm-admin__meetings { min-height: 390px; }
    .sm-admin__meeting-empty { min-height: 190px; }
  }

  @media (max-width: 760px) {
    .sm-admin__heading h1 { font-size: 34px; }
    .sm-admin__heading-actions { flex-direction: column; }
    .sm-admin__heading-actions button { width: 100%; }
    .sm-admin__metrics { grid-template-columns: 1fr; gap: 14px; }
    .sm-admin__metric { min-height: 154px; }
    .sm-admin__funnel { min-height: 0; padding: 24px 18px; }
    .sm-admin__funnel-stages { grid-template-columns: 1fr 1fr; }
    .sm-admin__funnel-stage,
    .sm-admin__funnel-stage:first-child { clip-path: none; align-items: flex-start; border-radius: 4px; }
    .sm-admin__funnel-stats { grid-template-columns: 1fr 1fr; row-gap: 28px; }
    .sm-admin__table-toolbar { padding: 0 12px; align-items: stretch; flex-direction: column; }
    .sm-admin__tabs { min-height: 56px; }
    .sm-admin__category-filter { padding: 0 0 13px; }
    .sm-admin__category-filter select { flex: 1; }
    .sm-admin__pagination-footer { align-items: flex-start; flex-direction: column; }
  }

  @media (max-width: 540px) {
    .sm-admin__dialog-backdrop { padding: 12px; }
    .sm-admin__dialog { padding: 24px 18px; }
    .sm-admin__dialog-form { grid-template-columns: 1fr; }
    .sm-admin__dialog-form label.is-wide,
    .sm-admin__dialog-actions { grid-column: 1; }
  }

  @media (prefers-reduced-motion: reduce) {
    .sm-admin__reveal,
    .sm-admin__funnel-stage,
    .sm-admin__dialog-backdrop,
    .sm-admin__dialog {
      opacity: 1;
      transform: none;
      animation: none;
    }

    .sm-admin *,
    .sm-admin *::before,
    .sm-admin *::after {
      scroll-behavior: auto !important;
      transition-duration: .01ms !important;
    }
  }
`;

const ServiceManagementAdmin = ({ query, onLocalAction }: ServiceManagementAdminProps) => {
  const [snapshot, setSnapshot] = useState<ServiceManagementSnapshot>(() =>
    serviceManagementRepository.getSnapshot(),
  );
  const [addServiceOpen, setAddServiceOpen] = useState(false);
  const [bulkAssignmentOpen, setBulkAssignmentOpen] = useState(false);
  const [requestToAssign, setRequestToAssign] = useState<ServiceRequest | null>(null);
  const [operationToEdit, setOperationToEdit] = useState<ServiceOperation | null>(null);

  useEffect(() => {
    const refresh = () => setSnapshot(serviceManagementRepository.getSnapshot());
    const unsubscribe = serviceManagementRepository.subscribe(refresh);
    window.addEventListener("focus", refresh);
    return () => {
      unsubscribe();
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const saveService = (input: NewServiceInput, existingId?: string) => {
    const service = serviceManagementRepository.createService(input, existingId);
    setSnapshot(serviceManagementRepository.getSnapshot());
    return service;
  };

  const assignProjectManager = (projectManager: string) => {
    if (!requestToAssign) return;
    setSnapshot(
      serviceManagementRepository.updateRequest(requestToAssign.id, {
        assignedPm: projectManager,
      }),
    );
    onLocalAction(`${projectManager} ditetapkan untuk ${requestToAssign.clientName}.`);
    setRequestToAssign(null);
  };

  const saveBulkAssignmentDraft = (input: BulkAssignmentInput) => {
    const record = serviceManagementRepository.saveBulkAssignmentDraft(input);
    setSnapshot(serviceManagementRepository.getSnapshot());
    onLocalAction(`Draft ${record.requestIds.length} request tersimpan secara lokal.`);
    return record;
  };

  const confirmBulkAssignment = (input: BulkAssignmentInput) => {
    const manager = snapshot.projectManagers.find(
      (item) => item.id === input.projectManagerId,
    );
    setSnapshot(serviceManagementRepository.confirmBulkAssignment(input));
    setBulkAssignmentOpen(false);
    onLocalAction(
      `${input.requestIds.length} request berhasil ditetapkan kepada ${manager?.name ?? "Project Manager"}.`,
    );
  };

  const updateRequestStatus = (id: string, status: ConsultationStatus) => {
    setSnapshot(serviceManagementRepository.updateRequest(id, { status }));
    onLocalAction(`Status consultation request diperbarui menjadi ${status}.`);
  };

  const updateOperation = (
    patch: Pick<ServiceOperation, "lifecycleStatus" | "budget" | "progress">,
  ) => {
    if (!operationToEdit) return;
    setSnapshot(
      serviceManagementRepository.updateOperation(operationToEdit.id, patch),
    );
    onLocalAction(`${operationToEdit.title} berhasil diperbarui secara lokal.`);
    setOperationToEdit(null);
  };

  if (bulkAssignmentOpen) {
    return (
      <Suspense
        fallback={(
          <div
            role="status"
            style={{
              display: "grid",
              minHeight: "60vh",
              placeItems: "center",
              color: "#edc64f",
              font: "700 14px ui-monospace, SFMono-Regular, Menlo, monospace",
              letterSpacing: ".13em",
              textTransform: "uppercase",
            }}
          >
            Preparing Assignment Workspace...
          </div>
        )}
      >
        <BulkAssignmentWorkspace
          draft={snapshot.latestAssignmentDraft}
          projectManagers={snapshot.projectManagers}
          requests={snapshot.requests}
          onClose={() => setBulkAssignmentOpen(false)}
          onConfirm={confirmBulkAssignment}
          onNotify={onLocalAction}
          onSaveDraft={saveBulkAssignmentDraft}
        />
      </Suspense>
    );
  }

  if (addServiceOpen) {
    return (
      <Suspense
        fallback={(
          <div
            role="status"
            style={{
              display: "grid",
              minHeight: "60vh",
              placeItems: "center",
              color: "#edc64f",
              font: "700 14px ui-monospace, SFMono-Regular, Menlo, monospace",
              letterSpacing: ".13em",
              textTransform: "uppercase",
            }}
          >
            Preparing Service Workspace...
          </div>
        )}
      >
        <AddServiceWorkspace
          onClose={() => setAddServiceOpen(false)}
          onNotify={onLocalAction}
          onSave={saveService}
        />
      </Suspense>
    );
  }

  return (
    <section className="sm-admin" aria-label="Tanya Mahreen Service Management">
      <style>{SERVICE_MANAGEMENT_STYLES}</style>

      <header className="sm-admin__heading sm-admin__reveal" style={{ "--sm-delay": "20ms" } as React.CSSProperties}>
        <div>
          <h1>Service Management</h1>
          <p>
            Manage Tanya Mahreen&apos;s consultancy portfolio. Monitor visibility,
            pricing structures, and service lifecycle statuses across the enterprise ecosystem.
          </p>
        </div>
        <div className="sm-admin__heading-actions">
          <button type="button" onClick={() => setBulkAssignmentOpen(true)}><UserRoundPlus aria-hidden="true" />Bulk<br />Assign PM</button>
          <button type="button" onClick={() => setAddServiceOpen(true)}><Plus aria-hidden="true" />Tambah<br />Service</button>
        </div>
      </header>

      <ServiceManagementMetrics metrics={snapshot.metrics} />
      <ServiceOperationalOverview
        meetings={snapshot.meetings}
        operations={snapshot.operations}
        requests={snapshot.requests}
        onCalendarOpen={() => onLocalAction(`${snapshot.meetings.length} jadwal tersedia pada penyimpanan lokal.`)}
      />
      <ServiceRequestsTable
        query={query}
        requests={snapshot.requests}
        onAssign={setRequestToAssign}
        onUpdate={updateRequestStatus}
      />
      <ServiceOperationsTable
        operations={snapshot.operations}
        query={query}
        onEdit={setOperationToEdit}
        onNotify={onLocalAction}
      />
      {requestToAssign ? <AssignPmDialog request={requestToAssign} onClose={() => setRequestToAssign(null)} onSubmit={assignProjectManager} /> : null}
      {operationToEdit ? <OperationEditDialog operation={operationToEdit} onClose={() => setOperationToEdit(null)} onSubmit={updateOperation} /> : null}
    </section>
  );
};

export default ServiceManagementAdmin;
