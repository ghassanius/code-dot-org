require 'test_helper'

class FollowerTest < ActiveSupport::TestCase
  setup do
    @laurel = create(:teacher)
    @laurel_section = create(:section, user: @laurel)
  end

  test "cannot follow yourself" do
    follower = Follower.create(
      user_id: @laurel.id,
      student_user_id: @laurel.id,
      section: @laurel_section
    )
    refute follower.valid?
  end

  test 'uses section.user and not follower.user' do
    follower = Follower.create(
      section: @laurel_section,
      student_user: create(:student)
    )
    follower.update_columns(user_id: create(:teacher).id)
    assert_equal @laurel, follower.user
  end
end
