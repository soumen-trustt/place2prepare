package com.soumenprogramming.onlinelearning.place2prepare.dashboard;

import com.soumenprogramming.onlinelearning.place2prepare.dashboard.dto.DashboardOverviewResponse;
import com.soumenprogramming.onlinelearning.place2prepare.dashboard.dto.DashboardStatsDto;
import com.soumenprogramming.onlinelearning.place2prepare.dashboard.dto.EnrolledCourseDto;
import com.soumenprogramming.onlinelearning.place2prepare.dashboard.dto.ScheduleItemDto;
import com.soumenprogramming.onlinelearning.place2prepare.learn.CourseAccessState;
import com.soumenprogramming.onlinelearning.place2prepare.learn.EnrollmentAccessService;
import com.soumenprogramming.onlinelearning.place2prepare.learn.dto.CourseAccessResponse;
import com.soumenprogramming.onlinelearning.place2prepare.live.LiveSessionService;
import com.soumenprogramming.onlinelearning.place2prepare.live.dto.LiveSessionResponse;
import com.soumenprogramming.onlinelearning.place2prepare.user.User;
import com.soumenprogramming.onlinelearning.place2prepare.user.UserRepository;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Objects;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class DashboardService {

    private static final DateTimeFormatter TIME_FORMATTER =
            DateTimeFormatter.ofPattern("EEE, h:mm a").withZone(ZoneId.systemDefault());

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final ActivityLogRepository activityLogRepository;
    private final LiveSessionService liveSessionService;
    private final EnrollmentAccessService enrollmentAccessService;

    public DashboardService(UserRepository userRepository,
                            EnrollmentRepository enrollmentRepository,
                            ActivityLogRepository activityLogRepository,
                            LiveSessionService liveSessionService,
                            EnrollmentAccessService enrollmentAccessService) {
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.activityLogRepository = activityLogRepository;
        this.liveSessionService = liveSessionService;
        this.enrollmentAccessService = enrollmentAccessService;
    }

    @Transactional(readOnly = true)
    public DashboardOverviewResponse getOverview(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "User not found"));

        List<Enrollment> enrollments = enrollmentRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<EnrolledCourseDto> activeCourses = enrollments.stream()
                .filter(enrollment -> enrollment.getStatus() == EnrollmentStatus.ACTIVE)
                .map(enrollment -> toAccessibleCourseDto(email, enrollment))
                .filter(Objects::nonNull)
                .toList();

        List<ScheduleItemDto> upcoming = liveSessionService.upcomingForStudent(email, 5).stream()
                .map(this::toScheduleItem)
                .toList();

        List<String> activity = activityLogRepository.findTop5ByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(ActivityLog::getMessage)
                .toList();

        DashboardStatsDto stats = new DashboardStatsDto(
                7,
                activeCourses.size(),
                (int) upcoming.size(),
                "9h 40m"
        );

        return new DashboardOverviewResponse(
                user.getFullName(),
                stats,
                activeCourses,
                upcoming,
                activity
        );
    }

    private EnrolledCourseDto toAccessibleCourseDto(String email, Enrollment enrollment) {
        CourseAccessResponse access = enrollmentAccessService.evaluate(email, enrollment.getCourse().getId());
        if (CourseAccessState.valueOf(access.accessState()) != CourseAccessState.ALLOWED) {
            return null;
        }
        return new EnrolledCourseDto(
                access.enrollmentId(),
                enrollment.getCourse().getId(),
                enrollment.getCourse().getTitle(),
                access.progress() == null ? enrollment.getProgressPercentage() : access.progress(),
                access.lessonsLeft() == null ? enrollment.getLessonsLeft() : access.lessonsLeft(),
                access.planType() == null ? enrollment.getPlanType() : access.planType(),
                enrollment.getStatus().name()
        );
    }

    private ScheduleItemDto toScheduleItem(LiveSessionResponse session) {
        return new ScheduleItemDto(
                session.id(),
                session.title(),
                TIME_FORMATTER.format(session.scheduledAt()),
                session.scheduledAt(),
                session.durationMinutes(),
                session.status(),
                session.courseId(),
                session.courseTitle(),
                session.joinUrl(),
                session.joinable()
        );
    }
}
