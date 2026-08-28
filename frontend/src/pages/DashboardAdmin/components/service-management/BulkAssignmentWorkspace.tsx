import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Filter,
  ListFilter,
  MapPin,
  Monitor,
  Save,
  Sparkles,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import type {
  AssignmentMeetingMode,
  AssignmentPriority,
  BulkAssignmentInput,
  BulkAssignmentRecord,
  ProjectManager,
  ServiceRequest,
} from "../../../../services/serviceManagement/serviceManagementRepository";
import BulkAssignmentRequestList from "./BulkAssignmentRequestList";
import ProjectManagerPicker from "./ProjectManagerPicker";

type BulkAssignmentWorkspaceProps = {
  requests: ServiceRequest[];
  projectManagers: ProjectManager[];
  draft: BulkAssignmentRecord | null;
  onClose: () => void;
  onSaveDraft: (input: BulkAssignmentInput) => BulkAssignmentRecord;
  onConfirm: (input: BulkAssignmentInput) => void;
  onNotify: (message: string) => void;
};

const BULK_ASSIGNMENT_STYLES = `
  .ba-admin {
    --ba-gold: #f2ca45;
    --ba-gold-soft: #d2b766;
    --ba-bg: #111211;
    --ba-panel: #181918;
    --ba-panel-soft: #1d1d1c;
    --ba-border: rgba(221, 190, 93, .2);
    --ba-border-strong: rgba(242, 202, 69, .56);
    position: relative;
    min-height: calc(100vh - 92px);
    padding: 12px 2px 42px;
    color: #efede8;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }

  .ba-admin::before {
    position: absolute;
    z-index: -1;
    top: -70px;
    right: 5%;
    width: 340px;
    height: 340px;
    border-radius: 50%;
    content: "";
    background: rgba(242, 202, 69, .035);
    filter: blur(75px);
    pointer-events: none;
  }

  .ba-enter {
    opacity: 0;
    transform: translate3d(0, 20px, 0) scale(.992);
    animation: ba-enter 660ms var(--ba-delay, 0ms) cubic-bezier(.22, 1, .36, 1) both;
  }

  .ba-heading {
    display: flex;
    min-height: 110px;
    margin-bottom: 24px;
    align-items: flex-start;
    justify-content: space-between;
    gap: 28px;
  }

  .ba-heading__copy > small {
    display: flex;
    margin-bottom: 13px;
    align-items: center;
    gap: 8px;
    color: #98938a;
    font: 700 9px/1.2 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .ba-heading__copy > small b {
    color: var(--ba-gold);
    font-weight: 700;
  }

  .ba-heading h1 {
    margin: 0;
    color: #f4f1eb;
    font-size: clamp(30px, 3vw, 44px);
    font-weight: 620;
    line-height: 1.05;
    letter-spacing: -.04em;
  }

  .ba-heading p {
    max-width: 730px;
    margin: 10px 0 0;
    color: #aaa49a;
    font-size: 14px;
    line-height: 1.55;
  }

  .ba-back {
    display: inline-flex;
    min-height: 43px;
    padding: 0 17px;
    align-items: center;
    gap: 9px;
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 5px;
    color: #aaa49a;
    background: rgba(255,255,255,.015);
    cursor: pointer;
    font: 700 9px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .11em;
    text-transform: uppercase;
    transition: color 200ms ease, border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease;
  }

  .ba-back:hover {
    color: var(--ba-gold);
    border-color: var(--ba-border-strong);
    box-shadow: 0 0 22px rgba(242,202,69,.08);
    transform: translateY(-2px);
  }

  .ba-back svg { width: 15px; height: 15px; }

  .ba-selection-banner {
    display: flex;
    min-height: 82px;
    margin-bottom: 28px;
    padding: 16px 22px;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    overflow: hidden;
    border: 1px solid rgba(242,202,69,.18);
    border-radius: 7px;
    background: radial-gradient(circle at 0 50%, rgba(242,202,69,.1), transparent 38%), linear-gradient(110deg, rgba(242,202,69,.055), transparent 62%), #1b1a14;
    box-shadow: 0 18px 44px rgba(0,0,0,.2), 0 0 28px rgba(242,202,69,.025);
  }

  .ba-selection-banner__copy {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .ba-selection-banner__copy > strong {
    display: grid;
    width: 39px;
    height: 39px;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 5px;
    color: #171306;
    background: var(--ba-gold);
    box-shadow: 0 0 20px rgba(242,202,69,.13);
    font: 800 12px ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .ba-selection-banner h2 {
    margin: 0;
    color: var(--ba-gold);
    font-size: 17px;
    font-weight: 650;
  }

  .ba-selection-banner p {
    margin: 3px 0 0;
    color: #9b958b;
    font-size: 11px;
  }

  .ba-selection-banner button {
    min-width: 154px;
    min-height: 39px;
    padding: 0 16px;
    border: 1px solid rgba(255,255,255,.13);
    border-radius: 3px;
    color: #aaa49a;
    background: transparent;
    cursor: pointer;
    font: 700 8px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .16em;
    text-transform: uppercase;
    transition: border-color 180ms ease, color 180ms ease, background 180ms ease;
  }

  .ba-selection-banner button:hover {
    color: #f0ede6;
    border-color: var(--ba-border-strong);
    background: rgba(242,202,69,.05);
  }

  .ba-config-grid,
  .ba-review-grid {
    display: grid;
    grid-template-columns: minmax(330px, .78fr) minmax(520px, 1.22fr);
    gap: 24px;
    align-items: start;
  }

  .ba-review-grid {
    grid-template-columns: minmax(560px, 1.25fr) minmax(390px, .85fr);
  }

  .ba-panel {
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 7px;
    background: linear-gradient(145deg, rgba(255,255,255,.018), transparent 56%), var(--ba-panel);
    box-shadow: 0 22px 58px rgba(0,0,0,.19);
    transition: border-color 260ms ease, box-shadow 260ms ease, transform 260ms cubic-bezier(.22,1,.36,1);
  }

  .ba-panel:hover {
    border-color: rgba(242,202,69,.24);
    box-shadow: 0 24px 64px rgba(0,0,0,.26), 0 0 30px rgba(242,202,69,.045);
  }

  .ba-config {
    padding: 27px 25px 24px;
  }

  .ba-config h2,
  .ba-review-managers h2,
  .ba-target-panel h2 {
    margin: 0;
    color: #efede8;
    font-size: 20px;
    font-weight: 630;
    letter-spacing: -.02em;
  }

  .ba-config > p {
    max-width: 340px;
    margin: 9px 0 23px;
    color: #a29c92;
    font-size: 11px;
    line-height: 1.55;
  }

  .ba-section-label {
    display: block;
    margin: 22px 0 10px;
    color: #aaa399;
    font: 700 8px/1.3 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .15em;
    text-transform: uppercase;
  }

  .ba-manager-list {
    display: grid;
    gap: 14px;
  }

  .ba-manager {
    position: relative;
    display: grid;
    width: 100%;
    min-height: 94px;
    padding: 14px 48px 14px 14px;
    grid-template-columns: 53px minmax(0,1fr);
    align-items: center;
    gap: 14px;
    overflow: hidden;
    border: 1px solid rgba(218,188,94,.2);
    border-radius: 5px;
    color: inherit;
    text-align: left;
    background: rgba(255,255,255,.008);
    cursor: pointer;
    opacity: 0;
    transform: translateX(-12px);
    animation: ba-row-enter 480ms var(--ba-row-delay, 0ms) cubic-bezier(.22,1,.36,1) both;
    transition: border-color 220ms ease, background 220ms ease, transform 220ms ease, box-shadow 220ms ease;
  }

  .ba-manager::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 3px;
    content: "";
    background: var(--ba-gold);
    opacity: 0;
    transition: opacity 220ms ease;
  }

  .ba-manager:hover {
    border-color: rgba(242,202,69,.36);
    background: rgba(242,202,69,.025);
    box-shadow: 0 0 24px rgba(242,202,69,.035);
    transform: translateX(3px);
  }

  .ba-manager.is-selected {
    border-color: rgba(242,202,69,.52);
    background: linear-gradient(90deg, rgba(242,202,69,.09), rgba(255,255,255,.045));
    box-shadow: 0 10px 30px rgba(0,0,0,.16), 0 0 25px rgba(242,202,69,.045);
  }

  .ba-manager.is-selected::before { opacity: 1; }

  .ba-manager > img {
    width: 53px;
    height: 53px;
    object-fit: cover;
    border: 1px solid rgba(242,202,69,.35);
    border-radius: 3px;
    filter: saturate(.72) contrast(1.04);
  }

  .ba-manager__body,
  .ba-manager__name,
  .ba-manager__meta {
    display: flex;
  }

  .ba-manager__body {
    min-width: 0;
    flex-direction: column;
  }

  .ba-manager__name {
    align-items: center;
    gap: 8px;
    color: #eeeae4;
    font: 700 12px/1.25 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .045em;
  }

  .ba-manager__name b {
    padding: 3px 6px;
    border: 1px solid rgba(242,202,69,.22);
    color: var(--ba-gold);
    background: rgba(242,202,69,.07);
    font-size: 7px;
    letter-spacing: .06em;
    text-transform: uppercase;
  }

  .ba-manager__specialization {
    margin-top: 4px;
    overflow: hidden;
    color: #9c968d;
    font-size: 9px;
    line-height: 1.35;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ba-manager__meta {
    margin-top: 8px;
    align-items: center;
    gap: 9px;
    color: #9a958c;
    font: 600 8px ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .ba-manager__meta > span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
  }

  .ba-manager__meta svg {
    width: 10px;
    height: 10px;
    color: var(--ba-gold);
    fill: var(--ba-gold);
  }

  .ba-manager__load-bars { gap: 3px !important; }

  .ba-manager__load-bars i {
    display: block;
    width: 13px;
    height: 4px;
    border-radius: 99px;
    background: rgba(255,255,255,.12);
  }

  .ba-manager__load-bars i.is-filled {
    background: var(--ba-gold);
    box-shadow: 0 0 7px rgba(242,202,69,.22);
  }

  .ba-manager__selector {
    position: absolute;
    top: 50%;
    right: 15px;
    display: grid;
    width: 24px;
    height: 24px;
    place-items: center;
    color: #8f8a81;
    transform: translateY(-50%);
  }

  .ba-manager.is-selected .ba-manager__selector {
    border-radius: 50%;
    color: #161306;
    background: var(--ba-gold);
    box-shadow: 0 0 17px rgba(242,202,69,.2);
  }

  .ba-manager__selector svg { width: 17px; height: 17px; }

  .ba-manager > small {
    position: absolute;
    right: 14px;
    bottom: 10px;
    color: var(--ba-gold);
    font: 700 6px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .05em;
    text-transform: uppercase;
  }

  .ba-manager-list.is-compact .ba-manager {
    min-height: 78px;
    padding: 10px 43px 10px 10px;
    grid-template-columns: 43px minmax(0,1fr);
  }

  .ba-manager-list.is-compact .ba-manager > img { width: 43px; height: 43px; }
  .ba-manager-list.is-compact .ba-manager__specialization { display: none; }
  .ba-manager-list.is-compact .ba-manager__meta { margin-top: 5px; }

  .ba-meeting-modes {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    border: 1px solid var(--ba-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .ba-meeting-modes button {
    display: inline-flex;
    min-height: 43px;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 0;
    border-right: 1px solid var(--ba-border);
    color: #a09a90;
    background: transparent;
    cursor: pointer;
    font: 650 9px ui-monospace, SFMono-Regular, Menlo, monospace;
    transition: color 180ms ease, background 180ms ease, box-shadow 180ms ease;
  }

  .ba-meeting-modes button:last-child { border-right: 0; }
  .ba-meeting-modes button svg { width: 13px; height: 13px; }
  .ba-meeting-modes button.is-active {
    color: #171306;
    background: var(--ba-gold);
    box-shadow: inset 0 0 18px rgba(255,255,255,.13), 0 0 18px rgba(242,202,69,.08);
  }

  .ba-datetime {
    position: relative;
    display: block;
    margin-top: 11px;
  }

  .ba-datetime svg {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 13px;
    width: 14px;
    color: #aaa49a;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .ba-datetime input {
    width: 100%;
    min-height: 43px;
    padding: 8px 12px 8px 39px;
    border: 1px solid var(--ba-border);
    border-radius: 4px;
    outline: 0;
    color: #dbd7d0;
    color-scheme: dark;
    background: #151615;
    font: 650 9px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .045em;
  }

  .ba-datetime input:focus {
    border-color: var(--ba-border-strong);
    box-shadow: 0 0 0 3px rgba(242,202,69,.045), 0 0 18px rgba(242,202,69,.04);
  }

  .ba-priority {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  .ba-priority button {
    min-width: 88px;
    min-height: 58px;
    padding: 8px 11px;
    border: 1px solid rgba(218,188,94,.22);
    border-radius: 3px;
    color: #918b82;
    background: transparent;
    cursor: pointer;
    font: 700 7px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .04em;
    text-transform: uppercase;
    transition: color 180ms ease, border-color 180ms ease, background 180ms ease, transform 180ms ease;
  }

  .ba-priority button:hover { transform: translateY(-2px); }
  .ba-priority button.is-active {
    color: var(--ba-gold);
    border-color: var(--ba-gold);
    background: rgba(242,202,69,.055);
    box-shadow: 0 0 17px rgba(242,202,69,.045);
  }

  .ba-primary-action,
  .ba-secondary-action {
    display: inline-flex;
    position: relative;
    width: 100%;
    min-height: 53px;
    margin-top: 20px;
    padding: 0 18px;
    align-items: center;
    justify-content: center;
    gap: 10px;
    overflow: hidden;
    border: 1px solid var(--ba-gold);
    border-radius: 3px;
    color: #181307;
    background: linear-gradient(135deg,#f8d65d,#edc440);
    box-shadow: 0 13px 30px rgba(242,202,69,.11);
    cursor: pointer;
    font: 800 9px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .16em;
    text-transform: uppercase;
    transition: transform 220ms cubic-bezier(.22,1,.36,1), filter 220ms ease, box-shadow 220ms ease;
  }

  .ba-primary-action::after {
    position: absolute;
    top: -50%;
    left: -35%;
    width: 30%;
    height: 200%;
    content: "";
    background: linear-gradient(90deg,transparent,rgba(255,255,255,.28),transparent);
    transform: rotate(18deg);
    transition: left 550ms ease;
  }

  .ba-primary-action:hover::after { left: 115%; }
  .ba-primary-action:hover {
    filter: brightness(1.06);
    box-shadow: 0 16px 38px rgba(242,202,69,.18), 0 0 26px rgba(242,202,69,.1);
    transform: translateY(-3px);
  }

  .ba-primary-action:disabled {
    opacity: .4;
    cursor: not-allowed;
    filter: grayscale(.45);
    transform: none;
  }

  .ba-primary-action svg,
  .ba-secondary-action svg { width: 15px; height: 15px; }

  .ba-secondary-action {
    margin-top: 11px;
    color: #d3cec5;
    border-color: rgba(218,188,94,.28);
    background: transparent;
    box-shadow: none;
  }

  .ba-secondary-action:hover {
    color: var(--ba-gold);
    border-color: var(--ba-border-strong);
    box-shadow: 0 0 20px rgba(242,202,69,.045);
    transform: translateY(-2px);
  }

  .ba-selected-panel { overflow: hidden; }

  .ba-selected-panel__header,
  .ba-target-panel__header {
    display: flex;
    min-height: 84px;
    padding: 20px 23px;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    border-bottom: 1px solid var(--ba-border);
  }

  .ba-selected-panel__header h2,
  .ba-target-panel__header h2 {
    margin: 0;
    color: #efede8;
    font-size: 15px;
    font-weight: 630;
  }

  .ba-selected-panel__header p {
    margin: 4px 0 0;
    color: #8f8a81;
    font-size: 9px;
  }

  .ba-selected-panel__header button {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 0;
    color: #a9a399;
    background: transparent;
    cursor: pointer;
    font: 700 7px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .ba-selected-panel__header button:hover { color: var(--ba-gold); }
  .ba-selected-panel__header button svg { width: 11px; height: 11px; }

  .ba-request-table-wrap {
    position: relative;
    min-height: 490px;
    overflow: auto;
  }

  .ba-request-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .ba-request-table th {
    height: 54px;
    padding: 10px 15px;
    color: #a19b92;
    background: rgba(255,255,255,.04);
    text-align: left;
    font: 700 8px/1.25 ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .ba-request-table th:nth-child(1) { width: 33%; }
  .ba-request-table th:nth-child(2) { width: 24%; }
  .ba-request-table th:nth-child(3) { width: 31%; }
  .ba-request-table th:last-child { width: 12%; text-align: center; }

  .ba-request-table td {
    height: 91px;
    padding: 14px 15px;
    border-bottom: 1px solid rgba(218,188,94,.14);
    color: #b6b0a7;
    font-size: 10px;
    line-height: 1.5;
    opacity: 0;
    animation: ba-table-row 480ms var(--ba-row-delay,0ms) ease both;
  }

  .ba-request-table td:last-child { text-align: center; }

  .ba-request-identity {
    display: flex;
    align-items: center;
    gap: 11px;
  }

  .ba-request-identity > b {
    display: grid;
    width: 29px;
    height: 29px;
    flex: 0 0 auto;
    place-items: center;
    border-radius: 50%;
    color: #e3c24f;
    background: rgba(242,202,69,.14);
    font: 800 8px ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .ba-request-identity > span {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
  }

  .ba-request-identity strong { color: #ddd9d2; font-size: 10px; }
  .ba-request-identity small {
    color: #817c74;
    font: 650 6px ui-monospace, SFMono-Regular, Menlo, monospace;
    text-transform: uppercase;
  }

  .ba-request-service {
    display: inline-block;
    max-width: 100%;
    padding: 7px 10px;
    overflow: hidden;
    border: 1px solid rgba(242,202,69,.13);
    border-radius: 7px;
    color: #c9af54;
    background: rgba(242,202,69,.055);
    font: 650 7px/1.35 ui-monospace, SFMono-Regular, Menlo, monospace;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ba-request-service.is-high {
    color: #e7b0ac;
    border-color: rgba(207,102,94,.2);
    background: rgba(174,70,65,.08);
  }

  .ba-remove-request {
    display: inline-grid;
    width: 30px;
    height: 30px;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: #aaa49a;
    background: transparent;
    cursor: pointer;
    transition: color 180ms ease, background 180ms ease, transform 180ms ease;
  }

  .ba-remove-request:hover { color: #f0c54a; background: rgba(242,202,69,.07); transform: rotate(90deg); }
  .ba-remove-request svg { width: 14px; height: 14px; }

  .ba-queue-status {
    position: absolute;
    right: 0;
    bottom: 38px;
    left: 0;
    display: grid;
    place-items: center;
    color: #5f5c56;
  }

  .ba-queue-status svg { width: 38px; height: 38px; opacity: .66; }
  .ba-queue-status span {
    margin-top: 8px;
    font: 700 7px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .22em;
    text-transform: uppercase;
  }

  .ba-request-empty {
    display: flex;
    min-height: 300px;
    padding: 30px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    color: #7e7a72;
  }

  .ba-request-empty svg { width: 42px; height: 42px; margin-bottom: 14px; }
  .ba-request-empty strong { color: #bcb6ad; font-size: 13px; }
  .ba-request-empty span { margin-top: 6px; font-size: 10px; }

  .ba-review-managers {
    padding: 27px 25px 24px;
  }

  .ba-review-managers__heading {
    display: flex;
    margin-bottom: 23px;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .ba-review-managers__tools { display: flex; gap: 8px; }
  .ba-review-managers__tools button {
    display: grid;
    width: 36px;
    height: 36px;
    place-items: center;
    border: 1px solid var(--ba-border);
    border-radius: 3px;
    color: #9f998f;
    background: transparent;
    cursor: pointer;
  }
  .ba-review-managers__tools button:hover { color: var(--ba-gold); border-color: var(--ba-border-strong); }
  .ba-review-managers__tools svg { width: 15px; height: 15px; }

  .ba-target-panel { overflow: hidden; }
  .ba-target-panel__header > span {
    padding: 5px 8px;
    color: var(--ba-gold);
    background: rgba(242,202,69,.08);
    font: 750 8px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .11em;
    text-transform: uppercase;
  }

  .ba-request-cards {
    display: grid;
    padding: 18px;
    gap: 14px;
  }

  .ba-request-card {
    padding: 16px;
    border: 1px solid rgba(218,188,94,.2);
    border-radius: 4px;
    background: rgba(255,255,255,.01);
    opacity: 0;
    animation: ba-table-row 480ms var(--ba-row-delay,0ms) ease both;
    transition: border-color 200ms ease, background 200ms ease, transform 200ms ease;
  }

  .ba-request-card:hover {
    border-color: rgba(242,202,69,.35);
    background: rgba(242,202,69,.018);
    transform: translateY(-2px);
  }

  .ba-request-card header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 14px;
  }

  .ba-request-card header > div { display: flex; flex-direction: column; gap: 4px; }
  .ba-request-card header strong { color: #e2ded7; font-size: 11px; }
  .ba-request-card header small { color: #827d75; font: 650 7px ui-monospace, SFMono-Regular, Menlo, monospace; }
  .ba-request-card header > span {
    max-width: 48%;
    padding: 5px 7px;
    overflow: hidden;
    border: 1px solid var(--ba-border);
    color: var(--ba-gold);
    font: 700 6px ui-monospace, SFMono-Regular, Menlo, monospace;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .ba-request-card p {
    display: flex;
    margin: 12px 0 6px;
    align-items: center;
    gap: 6px;
    color: #989289;
    font-size: 8px;
  }
  .ba-request-card p svg { width: 11px; height: 11px; }
  .ba-request-card > b {
    color: #a9a399;
    font: 650 7px ui-monospace, SFMono-Regular, Menlo, monospace;
    text-transform: uppercase;
  }
  .ba-request-card > b.is-urgent { color: #f1a89f; }
  .ba-request-card footer { display: grid; margin-top: 14px; grid-template-columns: 1fr 34px; gap: 8px; }
  .ba-request-card footer button {
    min-height: 34px;
    border: 1px solid var(--ba-border);
    color: #b8b1a8;
    background: transparent;
    cursor: pointer;
    font: 700 7px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .12em;
    text-transform: uppercase;
  }
  .ba-request-card footer button:hover { color: var(--ba-gold); border-color: var(--ba-border-strong); }
  .ba-request-card footer svg { width: 13px; height: 13px; }

  .ba-request-card__details {
    display: grid;
    margin-top: 13px;
    padding-top: 13px;
    grid-template-columns: 1fr 1fr;
    gap: 11px;
    border-top: 1px solid rgba(218,188,94,.14);
    animation: ba-enter 280ms ease both;
  }

  .ba-request-card__details span {
    display: flex;
    min-width: 0;
    flex-direction: column;
    gap: 4px;
  }

  .ba-request-card__details span:last-child { grid-column: 1 / -1; }
  .ba-request-card__details small {
    color: #78736b;
    font: 650 6px ui-monospace, SFMono-Regular, Menlo, monospace;
    letter-spacing: .1em;
    text-transform: uppercase;
  }

  .ba-request-card__details strong {
    overflow: hidden;
    color: #bcb6ad;
    font-size: 8px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ba-assignment-summary {
    display: grid;
    margin: 8px 18px 18px;
    padding: 20px 0 5px;
    grid-template-columns: 1fr auto;
    gap: 14px 24px;
    border-top: 1px solid var(--ba-border);
  }
  .ba-assignment-summary span { color: #9d978e; font: 650 10px ui-monospace, SFMono-Regular, Menlo, monospace; }
  .ba-assignment-summary strong { color: #ddd8d0; font-size: 11px; text-align: right; }
  .ba-assignment-summary strong.is-gold { color: var(--ba-gold); }
  .ba-assignment-summary p {
    margin: 7px 0 0;
    grid-column: 1 / -1;
    color: #706c65;
    font-size: 8px;
    line-height: 1.55;
    text-align: right;
  }

  .ba-review-managers .ba-primary-action { margin-top: 25px; }

  @keyframes ba-enter {
    from { opacity: 0; transform: translate3d(0,20px,0) scale(.992); }
    to { opacity: 1; transform: none; }
  }

  @keyframes ba-row-enter {
    from { opacity: 0; transform: translateX(-12px); }
    to { opacity: 1; transform: none; }
  }

  @keyframes ba-table-row {
    from { opacity: 0; transform: translateY(9px); }
    to { opacity: 1; transform: none; }
  }

  @media (max-width: 1180px) {
    .ba-config-grid,
    .ba-review-grid { grid-template-columns: 1fr; }
    .ba-request-table-wrap { min-height: 410px; }
    .ba-review-managers { order: 2; }
    .ba-target-panel { order: 1; }
  }

  @media (max-width: 720px) {
    .ba-admin { padding-top: 0; }
    .ba-heading { min-height: 0; flex-direction: column-reverse; }
    .ba-heading h1 { font-size: 31px; }
    .ba-back { align-self: flex-end; }
    .ba-selection-banner { align-items: flex-start; flex-direction: column; }
    .ba-selection-banner button { width: 100%; }
    .ba-config, .ba-review-managers { padding: 22px 15px; }
    .ba-selected-panel__header, .ba-target-panel__header { padding: 17px 15px; }
    .ba-request-table { min-width: 690px; }
    .ba-manager { grid-template-columns: 45px minmax(0,1fr); }
    .ba-manager > img { width: 45px; height: 45px; }
    .ba-priority { display: grid; grid-template-columns: repeat(3,1fr); }
    .ba-priority button { min-width: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .ba-enter,
    .ba-manager,
    .ba-request-table td,
    .ba-request-card { opacity: 1; transform: none; animation: none; }
    .ba-admin *, .ba-admin *::before, .ba-admin *::after { transition-duration: .01ms !important; }
  }
`;

const pad = (value: number) => String(value).padStart(2, "0");

const toDateTimeInput = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getDefaultMeetingTime = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  date.setHours(14, 0, 0, 0);
  return toDateTimeInput(date);
};

const meetingModes: Array<{
  value: AssignmentMeetingMode;
  icon: typeof Video;
}> = [
  { value: "Zoom", icon: Video },
  { value: "Meet", icon: Monitor },
  { value: "Offline", icon: MapPin },
];

const priorities: AssignmentPriority[] = ["Standard", "High Priority", "Urgent"];

const BulkAssignmentWorkspace = ({
  requests,
  projectManagers,
  draft,
  onClose,
  onSaveDraft,
  onConfirm,
  onNotify,
}: BulkAssignmentWorkspaceProps) => {
  const eligibleRequests = useMemo(
    () => requests.filter((request) => !["Archived", "Cancelled"].includes(request.status)),
    [requests],
  );
  const availableRequestIds = useMemo(
    () => new Set(eligibleRequests.map((request) => request.id)),
    [eligibleRequests],
  );
  const initialRequestIds = draft?.requestIds.filter((id) => availableRequestIds.has(id));
  const [selectedRequestIds, setSelectedRequestIds] = useState<string[]>(
    initialRequestIds?.length ? initialRequestIds : eligibleRequests.map((request) => request.id),
  );
  const [selectedManagerId, setSelectedManagerId] = useState(
    projectManagers.some((manager) => manager.id === draft?.projectManagerId)
      ? draft?.projectManagerId ?? ""
      : projectManagers[0]?.id ?? "",
  );
  const [meetingMode, setMeetingMode] = useState<AssignmentMeetingMode>(
    draft?.meetingMode ?? "Zoom",
  );
  const [meetingAt, setMeetingAt] = useState(
    draft?.scheduledAt ? toDateTimeInput(draft.scheduledAt) : getDefaultMeetingTime(),
  );
  const [priority, setPriority] = useState<AssignmentPriority>(
    draft?.priority ?? "High Priority",
  );
  const [phase, setPhase] = useState<"configure" | "review">("configure");

  const selectedRequests = eligibleRequests.filter((request) =>
    selectedRequestIds.includes(request.id),
  );
  const selectedManager = projectManagers.find(
    (manager) => manager.id === selectedManagerId,
  );
  const estimatedDays = Math.max(3, selectedRequests.length * 3 + 5);

  const buildInput = (): BulkAssignmentInput => ({
    requestIds: selectedRequestIds,
    projectManagerId: selectedManagerId,
    meetingMode,
    scheduledAt: meetingAt ? new Date(meetingAt).toISOString() : "",
    priority,
  });

  const removeRequest = (requestId: string) => {
    setSelectedRequestIds((current) => current.filter((id) => id !== requestId));
  };

  const saveDraft = () => {
    if (!selectedManagerId || selectedRequestIds.length === 0) {
      onNotify("Pilih minimal satu consultation request dan satu Project Manager.");
      return;
    }
    onSaveDraft(buildInput());
  };

  const openReview = () => {
    if (!selectedManagerId || selectedRequestIds.length === 0) {
      onNotify("Pilih minimal satu consultation request dan satu Project Manager.");
      return;
    }
    setPhase("review");
  };

  const confirm = () => {
    if (!selectedManager || selectedRequestIds.length === 0) return;
    onConfirm(buildInput());
  };

  return (
    <section className="ba-admin" aria-label="Bulk Project Manager Assignment">
      <style>{BULK_ASSIGNMENT_STYLES}</style>

      <header className="ba-heading ba-enter" style={{ "--ba-delay": "20ms" } as React.CSSProperties}>
        <div className="ba-heading__copy">
          <small>Operations Center <span>›</span> <b>Request Bulk PM Assignment</b></small>
          <h1>Assign Project Managers</h1>
          <p>Optimizing workforce allocation for Tanya Mahreen high-priority consultation requests.</p>
        </div>
        <button className="ba-back" type="button" onClick={phase === "review" ? () => setPhase("configure") : onClose}>
          <ArrowLeft aria-hidden="true" />{phase === "review" ? "Back to Configure" : "Service Management"}
        </button>
      </header>

      {phase === "configure" ? (
        <>
          <div className="ba-selection-banner ba-enter" style={{ "--ba-delay": "90ms" } as React.CSSProperties}>
            <div className="ba-selection-banner__copy">
              <strong>{pad(selectedRequests.length)}</strong>
              <div><h2>Requests Selected</h2><p>Batch operations will be applied to these sessions.</p></div>
            </div>
            <button type="button" onClick={onClose}>Cancel Selection</button>
          </div>

          <div className="ba-config-grid">
            <article className="ba-panel ba-config ba-enter" style={{ "--ba-delay": "150ms" } as React.CSSProperties}>
              <h2>Bulk Assign Project<br />Managers</h2>
              <p>Select multiple requests to assign PMs, schedule meetings, and set service parameters in batch.</p>

              <span className="ba-section-label">Assign Lead Project Manager</span>
              <ProjectManagerPicker managers={projectManagers} selectedId={selectedManagerId} onSelect={setSelectedManagerId} compact />

              <span className="ba-section-label">Meeting Configuration</span>
              <div className="ba-meeting-modes">
                {meetingModes.map(({ value, icon: Icon }) => (
                  <button className={meetingMode === value ? "is-active" : ""} type="button" onClick={() => setMeetingMode(value)} key={value}><Icon aria-hidden="true" />{value}</button>
                ))}
              </div>
              <label className="ba-datetime"><CalendarDays aria-hidden="true" /><input type="datetime-local" value={meetingAt} onChange={(event) => setMeetingAt(event.target.value)} aria-label="Meeting date and time" /></label>

              <span className="ba-section-label">Service Level Priority</span>
              <div className="ba-priority">
                {priorities.map((item) => <button className={priority === item ? "is-active" : ""} type="button" onClick={() => setPriority(item)} key={item}>{item}</button>)}
              </div>

              <button className="ba-primary-action" type="button" disabled={!selectedRequests.length || !selectedManager} onClick={openReview}><Sparkles aria-hidden="true" />Apply to All Selected<ArrowRight aria-hidden="true" /></button>
              <button className="ba-secondary-action" type="button" onClick={saveDraft}><Save aria-hidden="true" />Save as Draft</button>
            </article>

            <article className="ba-panel ba-selected-panel ba-enter" style={{ "--ba-delay": "220ms" } as React.CSSProperties}>
              <header className="ba-selected-panel__header">
                <div><h2>Selected Consultation Requests</h2><p>Reviewing items before bulk application.</p></div>
                <button type="button" onClick={() => setSelectedRequestIds([])}>⌫ Remove All</button>
              </header>
              <BulkAssignmentRequestList requests={selectedRequests} onRemove={removeRequest} />
            </article>
          </div>
        </>
      ) : (
        <div className="ba-review-grid">
          <article className="ba-panel ba-review-managers ba-enter" style={{ "--ba-delay": "70ms" } as React.CSSProperties}>
            <div className="ba-review-managers__heading">
              <h2>Available Project Managers</h2>
              <div className="ba-review-managers__tools"><button type="button" aria-label="Filter project managers"><Filter aria-hidden="true" /></button><button type="button" aria-label="Sort project managers"><ListFilter aria-hidden="true" /></button></div>
            </div>
            <ProjectManagerPicker managers={projectManagers} selectedId={selectedManagerId} onSelect={setSelectedManagerId} />
            <button className="ba-primary-action" type="button" onClick={confirm}><Check aria-hidden="true" />Confirm Assignment<ArrowRight aria-hidden="true" /></button>
          </article>

          <aside className="ba-panel ba-target-panel ba-enter" style={{ "--ba-delay": "140ms" } as React.CSSProperties}>
            <header className="ba-target-panel__header"><h2>Target Requests</h2><span>{selectedRequests.length} Selected</span></header>
            <BulkAssignmentRequestList requests={selectedRequests} onRemove={removeRequest} variant="cards" />
            <div className="ba-assignment-summary">
              <span>Estimated Timeline</span><strong>{estimatedDays} Business Days</strong>
              <span>Primary Lead</span><strong className="is-gold">{selectedManager?.name ?? "Not selected"}</strong>
              <p>Assigning a lead PM consolidates these requests into one locally managed batch for streamlined reporting.</p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default BulkAssignmentWorkspace;
