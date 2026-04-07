package com.main.EMS_backend.service;

import com.main.EMS_backend.dto.OrganiserEventDTO;
import com.main.EMS_backend.entity.Event;
import com.main.EMS_backend.entity.User;
import com.main.EMS_backend.exception.EventNotFoundException;
import com.main.EMS_backend.repository.EventRegistrationRepository;
import com.main.EMS_backend.repository.EventRepository;
import com.main.EMS_backend.repository.UserRepository;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;

@Service
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventRegistrationRepository eventRegistrationRepository;
    public EventService(EventRepository eventRepository, UserRepository userRepository, EventRegistrationRepository eventRegistrationRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.eventRegistrationRepository = eventRegistrationRepository;
    }
    public Event createEvent(Event event){
        return eventRepository.save(event);
    }
    public List<Event> getAllEvents() { return eventRepository.findAll(); }
    public Event findById(Long id) { return eventRepository.findById(id)
                .orElseThrow(() -> new EventNotFoundException("Event not found")); }

    public List<Event> getFilteredEvents(String category, String search) {
        LocalDate today = LocalDate.now();

        if(category!=null && !category.isEmpty()
                && search!=null && !search.isEmpty()){
            return eventRepository
                    .findByDateAfterAndCategoryAndEventNameContainingIgnoreCase(today, category, search);
        } else if (Objects.equals(category, "Previous")) {
            return eventRepository.findByDateBefore(today);
        } else if(category!=null && !category.isEmpty()){
            return eventRepository.findByDateAfterAndCategory(today, category);
        }
        else if(search!=null && !search.isEmpty()){
            return eventRepository
                    .findByDateAfterAndEventNameContainingIgnoreCase(today, search);
        }
        else{

            return eventRepository.findByDateAfter(today);
        }
    }

    public List<Event> getMyEvents(String email) {
        User user = userRepository.findByEmail(email);
        return eventRepository.findByCreatedBy(user);
    }

    public List<OrganiserEventDTO> getOrganiserEvents(String email) {
        User user = userRepository.findByEmail(email);
        List<Event> events = eventRepository.findByCreatedBy(user);
        return events.stream().map(event -> new OrganiserEventDTO(event,eventRegistrationRepository.countByEventId(event.getId()))).toList();
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public @Nullable Object updateEvent(Long id, String eventName, String category, String date, String time, String venue, String description, MultipartFile banner) throws IOException {
        Event event = eventRepository.findById(id).orElseThrow(() -> new EventNotFoundException("Event not found"));
        event.setEventName(eventName);
        event.setCategory(category);
        event.setDate(LocalDate.parse(date));
        event.setTime(LocalTime.parse(time));
        event.setVenue(venue);
        event.setDescription(description);
        if (banner != null && !banner.isEmpty()) {
            String fileName = banner.getOriginalFilename();
            Path path = Paths.get("uploads/"+fileName);
            Files.write(path,banner.getBytes());
            event.setBannerPath(fileName);
        }
        eventRepository.save(event);
        return "Event updated successfully";
    }
}
