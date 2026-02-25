# Requirements Document

## Introduction

This document specifies the requirements for updating AVAC company contact information in the ecosystem modal. The AVAC company currently displays incomplete information in the highlights section of the modal. This update will add complete contact details including address, telephone, hotline, and email to provide users with comprehensive information about AVAC.

## Glossary

- **Ecosystem_Modal**: The modal dialog component that displays detailed information about companies in the A Group ecosystem
- **AVAC**: A Vaccine company, a member of the A Group ecosystem specializing in vaccine production and disease prevention for livestock
- **Highlights_Array**: The TypeScript array data structure containing key information points displayed in the modal's highlights section
- **EcosystemWithModal_Component**: The React component file located at `appejv-web/src/components/EcosystemWithModal.tsx`
- **EcosystemModal_Component**: The React component file located at `appejv-web/src/components/EcosystemModal.tsx`

## Requirements

### Requirement 1: Update AVAC Contact Information in EcosystemWithModal Component

**User Story:** As a website visitor, I want to see complete AVAC contact information in the ecosystem modal, so that I can easily reach out to AVAC for inquiries.

#### Acceptance Criteria

1. THE EcosystemWithModal_Component SHALL include the address "Địa chỉ: QL 5A, Như Quỳnh, Hưng Yên" in the AVAC highlights array
2. THE EcosystemWithModal_Component SHALL include the telephone "Tel: 0221 3980 507" in the AVAC highlights array
3. THE EcosystemWithModal_Component SHALL include the hotline "Hotline: 0926 86 56 86" in the AVAC highlights array
4. THE EcosystemWithModal_Component SHALL include the email "Email: info@avac.com.vn" in the AVAC highlights array
5. THE EcosystemWithModal_Component SHALL preserve the existing four highlights about AVAC's capabilities
6. THE EcosystemWithModal_Component SHALL maintain the highlights array with exactly eight elements after the update

### Requirement 2: Update AVAC Contact Information in EcosystemModal Component

**User Story:** As a website visitor, I want to see consistent AVAC contact information across all modal implementations, so that I receive accurate information regardless of which component renders the modal.

#### Acceptance Criteria

1. THE EcosystemModal_Component SHALL include the address "Địa chỉ: QL 5A, Như Quỳnh, Hưng Yên" in the AVAC highlights array
2. THE EcosystemModal_Component SHALL include the telephone "Tel: 0221 3980 507" in the AVAC highlights array
3. THE EcosystemModal_Component SHALL include the hotline "Hotline: 0926 86 56 86" in the AVAC highlights array
4. THE EcosystemModal_Component SHALL include the email "Email: info@avac.com.vn" in the AVAC highlights array
5. THE EcosystemModal_Component SHALL preserve the existing four highlights about AVAC's capabilities
6. THE EcosystemModal_Component SHALL maintain the highlights array with exactly eight elements after the update

### Requirement 3: Data Consistency Between Components

**User Story:** As a developer, I want both modal components to display identical AVAC information, so that users have a consistent experience across the application.

#### Acceptance Criteria

1. WHEN both components are updated, THE Highlights_Array for AVAC SHALL contain identical content in both EcosystemWithModal_Component and EcosystemModal_Component
2. THE Highlights_Array SHALL maintain the same order of elements in both components
3. FOR ALL highlights in the AVAC array, the text formatting and Vietnamese characters SHALL be identical across both components

### Requirement 4: Preserve Existing Functionality

**User Story:** As a website visitor, I want the modal to continue functioning as before, so that the update does not disrupt my user experience.

#### Acceptance Criteria

1. WHEN the AVAC card is clicked, THE Ecosystem_Modal SHALL display all eight highlights in the highlights section
2. THE Ecosystem_Modal SHALL continue to display the AVAC logo, description, full description, services, and website link
3. THE Ecosystem_Modal SHALL render all highlights with the existing star icon and blue background styling
4. WHEN viewing the modal on mobile devices, THE Highlights_Array SHALL display in a responsive grid layout as before
