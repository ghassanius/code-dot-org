class Pd::ProfessionalLearningLandingController < ApplicationController
  before_action :require_admin

  PLC_COURSE_ORDERING = [
    'CSP Support',
    'ECS Support',
    'CS in Algebra Support',
    'CS in Science Support'
  ].freeze

  def index
    # Get the courses that this user teaches
    workshops = Pd::Workshop.enrolled_in_by(current_user)
    ended_workshops = workshops.in_state(Pd::Workshop::STATE_ENDED)

    courses_teaching = workshops.pluck(:course).uniq
    courses_completed = ended_workshops.pluck(:course).uniq

    last_enrollment_with_pending_survey = Pd::Enrollment.filter_for_survey_completion(
      Pd::Enrollment.where(email: current_user.email).where.not(survey_sent_at: nil),
      false
    ).try(:max_by, &:survey_sent_at)

    summarized_plc_enrollments = Plc::UserCourseEnrollment.where(user: current_user).map(&:summarize).sort_by do |enrollment|
      PLC_COURSE_ORDERING.index(enrollment[:courseName]) || PLC_COURSE_ORDERING.size
    end

    if courses_completed.include?(Pd::Workshop::COURSE_CSF)
      enrollment = Pd::Enrollment.where(pd_workshop_id: ended_workshops.where(course: Pd::Workshop::COURSE_CSF)).
          for_user(current_user).order(:survey_sent_at).last

      print_csf_certificate_url = CDO.studio_url("/pd/generate_csf_certificate/#{enrollment.try(:code)}")
    end

    # Link to the certificate
    @landing_page_data = {
      courses_teaching: courses_teaching,
      courses_completed: courses_completed,
      last_workshop_survey_url: last_enrollment_with_pending_survey && CDO.code_org_url("/pd-workshop-survey/#{last_enrollment_with_pending_survey.code}"),
      last_workshop_survey_course: last_enrollment_with_pending_survey.try(:workshop).try(:course),
      print_csf_certificate_url: print_csf_certificate_url,
      summarized_plc_enrollments: summarized_plc_enrollments
    }.compact
  end
end
